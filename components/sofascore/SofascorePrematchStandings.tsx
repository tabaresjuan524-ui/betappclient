import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// --- TYPE DEFINITIONS ---

interface Team {
  id: number;
  name: string;
}

interface StandingRow {
  team: Team;
  position: number;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  scoresFor: number;
  scoresAgainst: number;
  scoreDiff: number;
  scoreDiffFormatted: string;
  form?: string;
}

interface Standing {
  id: number;
  name: string;
  type: 'total' | 'home' | 'away';
  rows: StandingRow[];
}

interface StandingsData {
  standings: Standing[];
}

interface SofascorePrematchStandingsProps {
  standingsData?: StandingsData;
  homeTeamId: number;
  awayTeamId: number;
}

type TableView = 'total' | 'home' | 'away';
type ViewMode = 'short' | 'full' | 'form';

// --- HELPER COMPONENTS ---

const FormIndicator = ({ formString }: { formString: string }) => {
  const formItems = formString.split('').slice(0, 5);

  return (
    <div className="flex justify-end gap-1">
      {formItems.map((result, index) => {
        const bgColor =
          result === 'W'
            ? 'bg-green-600'
            : result === 'D'
            ? 'bg-yellow-500'
            : 'bg-red-600';
        return (
          <div
            key={index}
            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white`}
            title={result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
          >
            {result}
          </div>
        );
      })}
    </div>
  );
};

// --- MAIN COMPONENT ---

const SofascorePrematchStandings: React.FC<SofascorePrematchStandingsProps> = ({
  standingsData,
  homeTeamId,
  awayTeamId,
}) => {
  const [tableView, setTableView] = useState<TableView>('total');
  const [viewMode, setViewMode] = useState<ViewMode>('short');

  const activeStanding = standingsData?.standings?.find(
    (s) => s.type === tableView
  );

  if (!standingsData || !standingsData.standings || !activeStanding) {
    return (
      <div className="rounded-lg bg-white p-4 text-center text-gray-500 dark:bg-gray-800">
        No standings data available.
      </div>
    );
  }

  const viewModeLabels: Record<ViewMode, string> = {
    short: 'Short',
    full: 'Full',
    form: 'Form',
  };

  const renderTableHeader = () => {
    switch (viewMode) {
      case 'full':
        return (
          <>
            <TableHead className="w-12 text-center">P</TableHead>
            <TableHead className="w-12 text-center">W</TableHead>
            <TableHead className="w-12 text-center">D</TableHead>
            <TableHead className="w-12 text-center">L</TableHead>
            <TableHead className="hidden w-20 text-center md:table-cell">Goals</TableHead>
            <TableHead className="w-16 text-center">+/-</TableHead>
            <TableHead className="w-16 text-center">PTS</TableHead>
          </>
        );
      case 'form':
        return <TableHead className="text-right">Last 5</TableHead>;
      case 'short':
      default:
        return (
          <>
            <TableHead className="w-16 text-center">P</TableHead>
            <TableHead className="w-16 text-center">+/-</TableHead>
            <TableHead className="w-16 text-center">PTS</TableHead>
          </>
        );
    }
  };

  const renderTableRow = (row: StandingRow) => {
    switch (viewMode) {
      case 'full':
        return (
          <>
            <TableCell className="text-center font-medium">{row.matches}</TableCell>
            <TableCell className="text-center ">{row.wins}</TableCell>
            <TableCell className="text-center ">{row.draws}</TableCell>
            <TableCell className="text-center ">{row.losses}</TableCell>
            <TableCell className="hidden text-center md:table-cell">{`${row.scoresFor}:${row.scoresAgainst}`}</TableCell>
            <TableCell className="text-center">{row.scoreDiffFormatted}</TableCell>
            <TableCell className="text-center font-bold">{row.points}</TableCell>
          </>
        );
      case 'form':
        return (
          <TableCell>
            {row.form ? (
              <FormIndicator formString={row.form} />
            ) : (
              <span className="text-xs text-gray-400">N/A</span>
            )}
          </TableCell>
        );
      case 'short':
      default:
        return (
          <>
            <TableCell className="text-center font-medium">{row.matches}</TableCell>
            <TableCell className="text-center">{row.scoreDiffFormatted}</TableCell>
            <TableCell className="text-center font-bold">{row.points}</TableCell>
          </>
        );
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* View Mode: Short, Full, Form */}
        <div className="flex justify-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
          {(['short', 'full', 'form'] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              className={`h-8 text-xs capitalize ${
                viewMode === mode
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              onClick={() => setViewMode(mode)}
            >
              {viewModeLabels[mode]}
            </Button>
          ))}
        </div>

        {/* Table View: All, Home, Away */}
        <div className="flex justify-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
          {(['total', 'home', 'away'] as TableView[]).map((view) => (
            <Button
              key={view}
              variant="ghost"
              size="sm"
              className={`h-8 text-xs capitalize ${
                tableView === view
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              onClick={() => setTableView(view)}
            >
              {view === 'total' ? 'All' : view}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="w-64">Team</TableHead>
              {renderTableHeader()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeStanding.rows.map((row) => {
              const isHighlighted = row.team.id === homeTeamId || row.team.id === awayTeamId;

              return (
                <TableRow
                  key={row.team.id}
                  className={
                    isHighlighted ? 'bg-sky-50 dark:bg-sky-900/50' : ''
                  }
                >
                  <TableCell className="text-center font-bold text-slate-500 dark:text-slate-400">
                    {row.position}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={`https://api.sofascore.com/api/v1/team/${row.team.id}/image`}
                      alt={`${row.team.name} logo`}
                      width={24}
                      height={24}
                      className="inline-block"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.team.name}</span>
                  </TableCell>
                  {renderTableRow(row)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SofascorePrematchStandings;
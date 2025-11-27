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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

// --- TYPE DEFINITIONS ---

interface Team {
    id: number;
    name: string;
    slug: string;
    gender: string;
    nameCode: string;
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
    form?: string; // e.g., "WWLWD"
}

interface Standing {
    id: number;
    name: string;
    type: 'total' | 'home' | 'away';
    rows: StandingRow[];
    updatedAtTimestamp: number;
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
    const formItems = formString.split('').slice(-5); // Take the last 5 games

    return (
        <div className="flex justify-end gap-1">
            {formItems.map((result, index) => {
                const bgColor =
                    result === 'W'
                        ? 'bg-green-600 dark:bg-green-500'
                        : result === 'D'
                        ? 'bg-gray-500 dark:bg-gray-400'
                        : 'bg-red-600 dark:bg-red-500';
                const title = result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss';
                return (
                    <div
                        key={index}
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${bgColor}`}
                        title={title}
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
            <div className="bg-card text-card-foreground rounded-lg p-4 text-center text-muted-foreground">
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
                        <TableHead className="w-[10%] text-center">P</TableHead>
                        <TableHead className="w-[10%] text-center">W</TableHead>
                        <TableHead className="w-[10%] text-center">D</TableHead>
                        <TableHead className="w-[10%] text-center">L</TableHead>
                        <TableHead className="w-[15%] text-center hidden md:table-cell">Goals</TableHead>
                        <TableHead className="w-[10%] text-center">+/-</TableHead>
                        <TableHead className="w-[10%] text-center">PTS</TableHead>
                    </>
                );
            case 'form':
                return <TableHead className="w-[55%] text-right">Last 5</TableHead>;
            case 'short':
            default:
                return (
                    <>
                        <TableHead className="w-[15%] text-center">P</TableHead>
                        <TableHead className="w-[20%] text-center">+/-</TableHead>
                        <TableHead className="w-[20%] text-center">PTS</TableHead>
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
                        <TableCell className="text-center text-green-500">{row.wins}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.draws}</TableCell>
                        <TableCell className="text-center text-red-500">{row.losses}</TableCell>
                        <TableCell className="text-center hidden md:table-cell text-muted-foreground">{`${row.scoresFor}:${row.scoresAgainst}`}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.scoreDiffFormatted}</TableCell>
                        <TableCell className="text-center font-bold">{row.points}</TableCell>
                    </>
                );
            case 'form':
                return (
                    <TableCell>
                        {row.form ? (
                            <FormIndicator formString={row.form} />
                        ) : (
                            <span className="text-xs text-muted-foreground float-right">N/A</span>
                        )}
                    </TableCell>
                );
            case 'short':
            default:
                return (
                    <>
                        <TableCell className="text-center font-medium">{row.matches}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.scoreDiffFormatted}</TableCell>
                        <TableCell className="text-center font-bold">{row.points}</TableCell>
                    </>
                );
        }
    };

    return (
        <div className="bg-card text-card-foreground rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1"></div>
                <div className="flex flex-1 justify-center gap-1 p-1 bg-muted rounded-md">
                    {(['total', 'home', 'away'] as TableView[]).map((view) => (
                        <Button
                            key={view}
                            variant={tableView === view ? 'primary' : 'ghost'}
                            size="sm"
                            className="capitalize text-xs h-8 flex-1"
                            onClick={() => setTableView(view)}
                        >
                            {view === 'total' ? 'All' : view}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-1 justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 text-xs">
                                {viewModeLabels[viewMode]}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {(['short', 'full', 'form'] as ViewMode[]).map((mode) => (
                                <DropdownMenuItem key={mode} onSelect={() => setViewMode(mode)}>
                                    {viewModeLabels[mode]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10%] text-center">#</TableHead>
                        <TableHead className="w-[35%]">Team</TableHead>
                        {renderTableHeader()}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activeStanding.rows.map((row) => {
                        const isHighlighted = row.team.id === homeTeamId || row.team.id === awayTeamId;
                        const rowClass = isHighlighted ? 'bg-muted/80' : '';

                        return (
                            <TableRow key={row.team.id} className={rowClass}>
                                <TableCell className="text-center font-semibold text-muted-foreground">{row.position}</TableCell>
                                <TableCell className="flex items-center gap-3">
                                    <Image
                                        src={`https://api.sofascore.com/api/v1/team/${row.team.id}/image`}
                                        alt={`${row.team.name} logo`}
                                        width={24}
                                        height={24}
                                        className="inline-block object-contain"
                                    />
                                    <span className="font-semibold truncate text-sm text-foreground">{row.team.name}</span>
                                </TableCell>
                                {renderTableRow(row)}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default SofascorePrematchStandings;

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PartnerInfo } from "../data/partners";

interface PartnersCarouselProps {
  partners: PartnerInfo[];
  partnerStartIndex: number;
  setPartnerStartIndex: (idx: number) => void;
  partnersPerPage: number;
}

const PartnersCarousel: React.FC<PartnersCarouselProps> = ({
  partners,
  partnerStartIndex,
  setPartnerStartIndex,
  partnersPerPage,
}) => {
  const visiblePartners = partners.slice(
    partnerStartIndex,
    partnerStartIndex + partnersPerPage
  );
  const canGoPrevPartners = partnerStartIndex > 0;
  const canGoNextPartners =
    partnerStartIndex <
      Math.max(0, partners.length - partnersPerPage) &&
    partners.length > partnersPerPage;

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Partners
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPartnerStartIndex(Math.max(0, partnerStartIndex - 1))}
            disabled={!canGoPrevPartners}
            className={`bg-slate-200 dark:bg-zinc-800 p-1 rounded-full ${!canGoPrevPartners
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-300 dark:hover:bg-zinc-700"
              }`}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>
          <button
            onClick={() =>
              setPartnerStartIndex(
                Math.min(
                  partnerStartIndex + 1,
                  Math.max(0, partners.length - partnersPerPage)
                )
              )
            }
            disabled={!canGoNextPartners}
            className={`bg-slate-200 dark:bg-zinc-800 p-1 rounded-full ${!canGoNextPartners
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-300 dark:hover:bg-zinc-700"
              }`}
          >
            <ArrowRight className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {visiblePartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center h-16 transition-all duration-300 p-2"
          >
            <img
              src={partner.url}
              alt={partner.text}
              className="h-8 max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersCarousel;
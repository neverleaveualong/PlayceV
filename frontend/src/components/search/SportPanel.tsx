import { useSportStore } from "@/stores/sportStore";
import { useSports } from "@/hooks/useSports";
import { useLeagues } from "@/hooks/useLeagues";
import { getUpdatedLeagueSelection } from "@/utils/sportUtils";
import Tag from "@/components/common/Tag";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { FiTv } from "react-icons/fi";

const SportPanel = () => {
  const { sport, selectedLeagues, setSport, setSelectedLeagues } =
    useSportStore();
  const { data: sports = [], isLoading: sportsLoading } = useSports();
  const selectedSportId = sports.find((s) => s.name === sport)?.id;
  const { data: leagues = [], isLoading: leaguesLoading } = useLeagues(selectedSportId);

  const handleLeagueClick = (leagueName: string) => {
    const updated = getUpdatedLeagueSelection(
      selectedLeagues,
      sport,
      leagueName
    );
    setSelectedLeagues(updated);
  };

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden rounded-lg border border-gray-200 h-[55vh] md:h-[280px]">
        {/* 종목 */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 border-r border-gray-200">
          {sportsLoading ? (
            <LoadingSpinner />
          ) : (
            sports.map((s) => (
              <button
                key={s.id}
                onClick={() => setSport(s.name)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  s.name === sport
                    ? "bg-white text-primary5 font-semibold border-r-2 border-primary5"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s.name}
              </button>
            ))
          )}
        </div>

        {/* 리그 */}
        <div className="w-1/2 overflow-y-auto">
          {!sport ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <FiTv className="text-xl text-gray-300" />
              <p className="text-xs text-center">
                종목을 선택하면
                <br />
                리그가 표시됩니다
              </p>
            </div>
          ) : leaguesLoading ? (
            <LoadingSpinner />
          ) : (
            leagues.map((l) => {
              const isChecked = selectedLeagues.some(
                (r) => r.sport === sport && r.league === l.name
              );

              return (
                <label
                  key={l.id}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                    isChecked
                      ? "bg-primary4/50 text-primary5 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{l.name}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-primary5 border-primary5"
                        : "border-gray-300"
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => handleLeagueClick(l.name)}
                  />
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 선택된 태그 */}
      {selectedLeagues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3">
          {selectedLeagues.map((r) => {
            const label =
              r.league === "전체"
                ? `${r.sport} 전체`
                : `${r.sport} ${r.league}`;

            return (
              <Tag
                key={`${r.sport}-${r.league}`}
                label={label}
                onRemove={() => {
                  const updated = getUpdatedLeagueSelection(
                    selectedLeagues,
                    r.sport,
                    r.league
                  );
                  setSelectedLeagues(updated);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SportPanel;

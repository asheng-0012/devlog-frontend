import { useDispatch, useSelector } from "react-redux";
import { Clock, Crown, Flame } from "lucide-react";
import withPageShell from "../hoc/withPageShell";
import { setPeriod } from "../redux/leaderboardSlice";

const GOLD = "#8a6a2b";

function initials(name) {
  const parts = name.split(/[._]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function ordinal(n) {
  return n === 1 ? "1st" : n === 2 ? "2nd" : "3rd";
}

function PodiumCard({ player, first }) {
  return (
    <div
      className={`neu-raised flex min-w-0 flex-1 flex-col items-center justify-center rounded-3xl px-3 text-center sm:max-w-[300px] ${
        first
          ? "min-h-[300px] py-6 sm:min-h-[360px]"
          : "min-h-[220px] py-5 sm:min-h-[264px]"
      }`}
    >
      {first && <Crown className="mb-3 h-6 w-6 text-brand" />}

      <div
        className={`neu-raised flex items-center justify-center rounded-full font-medium ${
          first
            ? "h-[72px] w-[72px] text-xl text-brand sm:h-[92px] sm:w-[92px] sm:text-2xl"
            : "h-14 w-14 text-base text-ink sm:h-[78px] sm:w-[78px] sm:text-xl"
        }`}
      >
        {initials(player.name)}
      </div>

      <p className="mt-4 w-full truncate text-lg font-medium text-ink sm:text-xl">
        {player.name}
      </p>
      <p className="mt-1 text-muted">{player.points} pts</p>
      <p className={`mt-3 ${first ? "text-brand" : "text-muted"}`}>
        {ordinal(player.rank)}
      </p>
    </div>
  );
}

function Leaderboard() {
  const dispatch = useDispatch();
  const { period, boards } = useSelector((s) => s.leaderboard);
  const authState = useSelector((s) => s.auth);

  const board = boards[period];
  const { you, players, totalPlayers } = board;

  const fullName = authState?.user?.name ?? authState?.name ?? "Alex Kim";
  const firstName = fullName.split(" ")[0];

  const topPercent = Math.max(1, Math.ceil((you.rank / totalPlayers) * 100));
  const progress = Math.round((you.points / (you.points + you.gap)) * 100);

  const maxPoints = players[0].points;
  const podium = [players[1], players[0], players[2]]; // 2nd, 1st, 3rd
  const rest = players.slice(3);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-emboss text-4xl font-semibold text-ink">
            Leaderboard
          </h1>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <Clock className="h-4 w-4" />
            {board.resets}
          </p>
        </div>

        <div className="neu-inset flex rounded-full p-1.5">
          {["daily", "weekly"].map((p) => (
            <button
              key={p}
              onClick={() => dispatch(setPeriod(p))}
              className={`rounded-full px-5 py-2 text-lg transition sm:px-7 ${
                period === p
                  ? "neu-raised-sm font-medium text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {boards[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Your position */}
      <div className="neu-raised flex flex-wrap items-center gap-5 rounded-3xl p-5 sm:gap-6 sm:p-6">
        <div className="neu-raised flex h-24 w-24 shrink-0 items-center justify-center rounded-full sm:h-28 sm:w-28">
          <span className="text-3xl font-semibold text-brand">#{you.rank}</span>
        </div>

        <div className="min-w-[200px] flex-1">
          <p className="text-xl font-medium text-ink">Your position</p>
          <p className="mt-1 text-muted">
            {you.points} points · top {topPercent}% of{" "}
            {totalPlayers.toLocaleString()} players
          </p>
          <div className="neu-inset mt-4 h-3 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-medium text-brand">{you.gap} points</p>
          <p className="text-muted">to reach #{you.rank - 1}</p>
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {podium.map((p) => (
          <PodiumCard key={p.rank} player={p} first={p.rank === 1} />
        ))}
      </div>

      {/* Chart + list */}
      <div className="grid gap-6 lg:grid-cols-[9fr_10fr]">
        {/* Bar chart */}
        <div className="neu-raised rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-medium text-ink">{board.chartTitle}</h2>
          <p className="mt-1 text-muted">Top 7 and you</p>

          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex flex-1 gap-2 sm:gap-3">
              {players.map((p) => (
                <div key={p.rank} className="flex flex-1 flex-col items-center gap-3">
                  <div className="neu-inset relative h-[220px] w-full rounded-2xl">
                    <div
                      className="absolute bottom-0 w-full rounded-2xl bg-brand transition-[height] duration-500"
                      style={{ height: `${(p.points / maxPoints) * 100}%` }}
                    />
                  </div>
                  <span className="text-muted">{p.rank}</span>
                </div>
              ))}
            </div>

            <div className="w-px self-stretch bg-black/10" />

            <div className="flex w-[13%] min-w-[44px] flex-col items-center gap-3">
              <div className="neu-inset relative h-[220px] w-full rounded-2xl">
                <div
                  className="absolute bottom-0 w-full rounded-2xl transition-[height] duration-500"
                  style={{
                    height: `${(you.points / maxPoints) * 100}%`,
                    background: GOLD,
                  }}
                />
              </div>
              <span className="font-medium" style={{ color: GOLD }}>
                You
              </span>
            </div>
          </div>
        </div>

        {/* Ranks 4-7 + you */}
        <div className="neu-raised flex flex-col rounded-3xl p-4 sm:p-5">
          <div className="px-2">
            {rest.map((p) => (
              <div
                key={p.rank}
                className="flex items-center border-b border-black/10 py-5 text-lg"
              >
                <span className="w-12 text-muted">{p.rank}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {p.name}
                </span>
                <span className="mr-6 text-muted">{p.solved} solved</span>
                <span className="w-14 text-right font-semibold text-ink">
                  {p.points}
                </span>
              </div>
            ))}
          </div>

          <p className="py-4 text-center tracking-[0.3em] text-muted">···</p>

          <div className="neu-inset mt-auto flex items-center rounded-2xl px-5 py-4 text-lg">
            <span className="w-12 font-medium text-brand">{you.rank}</span>
            <span className="min-w-0 flex-1 truncate font-medium text-ink">
              {firstName} (you)
            </span>
            <span className="mr-6 flex items-center gap-1 text-muted">
              <Flame className="h-4 w-4" />
              {you.streak}
            </span>
            <span className="w-14 text-right font-semibold text-brand">
              {you.points}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withPageShell(Leaderboard);
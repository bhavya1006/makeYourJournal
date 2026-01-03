import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface ProgressData {
  date: string; // YYYY-MM-DD
  completion: number;
  day: string;
  tasksCompleted: number;
  totalTasks: number;
}

interface ProgressGraphProps {
  data: ProgressData[];
}

export function ProgressGraph({ data }: ProgressGraphProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const averageCompletion =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.completion, 0) / data.length
        )
      : 0;

  const maxTasksCompleted = Math.max(...data.map(d => d.tasksCompleted), 0);
  const totalTasks = data.length > 0 ? data[0].totalTasks : 10;
  const yAxisMax = Math.max(totalTasks, maxTasksCompleted + 1);

  const generateYTicks = () => {
    const ticks: number[] = [];
    const step =
      yAxisMax <= 5 ? 1 : yAxisMax <= 10 ? 2 : Math.ceil(yAxisMax / 5);
    for (let i = 0; i <= yAxisMax; i += step) ticks.push(i);
    if (!ticks.includes(yAxisMax)) ticks.push(yAxisMax);
    return ticks;
  };

  const CustomDot = ({ cx, cy }: any) => {
    if (!cx || !cy) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#667eea"
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  };

  /** 🔹 AUTO CENTER TODAY ON LOAD */
  const today = new Date().toISOString().slice(0, 10);
  const todayIndex = data.findIndex(d => d.date === today);

  useEffect(() => {
    if (!scrollRef.current || todayIndex === -1) return;

    const container = scrollRef.current;
    const containerWidth = container.clientWidth;

    const chartWidth =
      typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 450;

    const itemWidth = chartWidth / data.length;

    const scrollTo =
      todayIndex * itemWidth - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: Math.max(0, scrollTo),
      behavior: 'smooth',
    });
  }, [todayIndex, data.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-white rounded-xl border border-border/50 shadow-sm p-4 sm:p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 sm:size-10 rounded-lg bg-primary/5 flex items-center justify-center">
            <TrendingUp className="size-4 sm:size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base">Progress</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Last 7 days
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl">{averageCompletion}%</span>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Avg completion
          </p>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          <div className="min-w-[320px]">
            <ComposedChart
              data={data}
              width={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 320
                  : 450
              }
              height={320}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                ticks={generateYTicks()}
                domain={[0, yAxisMax]}
                label={{
                  value: 'Tasks Completed',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#9ca3af', fontSize: 10 },
                }}
              />
              <Tooltip
                cursor={{
                  stroke: '#667eea',
                  strokeWidth: 1,
                  strokeDasharray: '5 5',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white rounded-lg shadow-lg border border-border/50 p-3">
                        <p className="text-muted-foreground text-xs mb-1">
                          {d.date}
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          <span className="text-lg">{d.tasksCompleted}</span>
                          <span className="text-muted-foreground text-xs">
                            / {d.totalTasks}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          {d.completion}% completed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="tasksCompleted"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Scatter
                dataKey="tasksCompleted"
                fill="#667eea"
                shape={<CustomDot />}
              />
            </ComposedChart>
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Best day</p>
          </div>
          <p>
            {data.length > 0
              ? data.reduce((a, b) =>
                  b.tasksCompleted > a.tasksCompleted ? b : a
                ).day
              : 'N/A'}
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Trend</p>
          </div>
          <p>
            {data.length >= 2 &&
            data[data.length - 1].tasksCompleted >
              data[0].tasksCompleted
              ? '↗ Improving'
              : data.length >= 2 &&
                data[data.length - 1].tasksCompleted <
                  data[0].tasksCompleted
              ? '↘ Declining'
              : '→ Stable'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

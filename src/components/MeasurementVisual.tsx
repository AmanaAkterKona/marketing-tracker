import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  category: "touchpoint" | "core" | "destination";
  status: string;
  metric: string;
}

const NODES: Node[] = [
  // Touchpoint / Signal nodes
  {
    id: "n1",
    x: 75,
    y: 70,
    label: "Touchpoint α",
    category: "touchpoint",
    status: "Active Stream",
    metric: "100% Captured",
  },
  {
    id: "n2",
    x: 60,
    y: 170,
    label: "Client Signal",
    category: "touchpoint",
    status: "Encrypted Token",
    metric: "Hash: SHA-256",
  },
  {
    id: "n3",
    x: 80,
    y: 270,
    label: "Offline Webhook",
    category: "touchpoint",
    status: "CRM Pipeline",
    metric: "Async Queue",
  },

  // Core
  {
    id: "c1",
    x: 220,
    y: 120,
    label: "Identity Resolution",
    category: "core",
    status: "Cross-Domain",
    metric: "Match Rate 98.6%",
  },
  {
    id: "c2",
    x: 230,
    y: 220,
    label: "Server Coordination",
    category: "core",
    status: "Deduplicated",
    metric: "Window: 7-day click",
  },

  // Destination
  {
    id: "d1",
    x: 380,
    y: 80,
    label: "Platform Attribution",
    category: "destination",
    status: "Deterministic",
    metric: "Event Value Sync",
  },
  {
    id: "d2",
    x: 395,
    y: 170,
    label: "Unified Event Store",
    category: "destination",
    status: "First-Party",
    metric: "Zero Data Loss",
  },
  {
    id: "d3",
    x: 375,
    y: 260,
    label: "Closed-Loop Feedback",
    category: "destination",
    status: "Reconciled",
    metric: "LTV & ROAS Calibration",
  },
];

const PATHS = [
  {
    from: "n1",
    to: "c1",
    d: "M 75 70 C 145 70, 150 120, 220 120",
  },
  {
    from: "n2",
    to: "c1",
    d: "M 60 170 C 130 170, 150 120, 220 120",
  },
  {
    from: "n2",
    to: "c2",
    d: "M 60 170 C 130 170, 160 220, 230 220",
  },
  {
    from: "n3",
    to: "c2",
    d: "M 80 270 C 150 270, 160 220, 230 220",
  },
  {
    from: "c1",
    to: "d1",
    d: "M 220 120 C 295 120, 310 80, 380 80",
  },
  {
    from: "c1",
    to: "d2",
    d: "M 220 120 C 295 120, 320 170, 395 170",
  },
  {
    from: "c2",
    to: "d2",
    d: "M 230 220 C 300 220, 325 170, 395 170",
  },
  {
    from: "c2",
    to: "d3",
    d: "M 230 220 C 300 220, 310 260, 375 260",
  },
];

export const MeasurementVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<Node>(NODES[3]);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % PATHS.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      id="measurement-visual"
      initial={{
        opacity: 0,
        x: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="
        relative
        w-full
        max-w-[480px]
        mx-auto
        rounded-2xl
        border
        border-[#0B9FA3]/15
        bg-white/80
        p-5
        shadow-[0_12px_40px_rgba(8,126,130,0.08)]
        backdrop-blur-xs
      "
    >
      {/* Soft background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -top-20
          -right-20
          w-40
          h-40
          rounded-full
          bg-[#27C8C8]/10
          blur-3xl
        "
      />

      {/* ================================
          TOP TELEMETRY HEADER
      ================================= */}

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.25,
          duration: 0.5,
        }}
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          pb-3.5
          border-b
          border-[#0B7F84]/10
          mb-2
        "
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="
                animate-ping
                absolute
                inline-flex
                h-full
                w-full
                rounded-full
                bg-[#21C5C6]
                opacity-60
              "
            />

            <span
              className="
                relative
                inline-flex
                rounded-full
                h-2
                w-2
                bg-[#07979A]
              "
            />
          </span>

          <span
            className="
              font-mono
              text-[11px]
              font-semibold
              tracking-wide
              uppercase
              text-[#49656B]
            "
          >
            Attribution Network
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            px-2
            py-0.5
            rounded-full
            bg-[#E8F8F7]
            border
            border-[#0B9FA3]/10
            text-[11px]
            font-mono
            text-[#087E82]
          "
        >
          <ShieldCheck
            className="w-3 h-3 text-[#087E82]"
          />

          <span>Server Verified</span>
        </div>
      </motion.div>

      {/* ================================
          SVG NETWORK
      ================================= */}

      <div className="relative w-full aspect-[480/340] select-none">
        <svg
          viewBox="0 0 460 330"
          className="w-full h-full overflow-visible"
          aria-label="Abstract attribution and measurement network visualization"
        >
          <defs>

            {/* Main teal gradient */}

            <linearGradient
              id="pathGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#B6E5E3"
                stopOpacity="0.7"
              />

              <stop
                offset="50%"
                stopColor="#0B9FA3"
                stopOpacity="0.75"
              />

              <stop
                offset="100%"
                stopColor="#8DD7D5"
                stopOpacity="0.7"
              />
            </linearGradient>

            {/* Active gradient */}

            <linearGradient
              id="activeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#0B7F84"
              />

              <stop
                offset="50%"
                stopColor="#19BFC0"
              />

              <stop
                offset="100%"
                stopColor="#087E82"
              />
            </linearGradient>

            {/* Node glow */}

            <radialGradient
              id="nodeGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#0B9FA3"
                stopOpacity="0.24"
              />

              <stop
                offset="65%"
                stopColor="#0B9FA3"
                stopOpacity="0.08"
              />

              <stop
                offset="100%"
                stopColor="#0B9FA3"
                stopOpacity="0"
              />
            </radialGradient>

            {/* Core glow */}

            <radialGradient
              id="coreGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#19BFC0"
                stopOpacity="0.25"
              />

              <stop
                offset="100%"
                stopColor="#19BFC0"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          {/* ================================
              COORDINATE GRID
          ================================= */}

          <g
            className="opacity-40"
            stroke="#CBE7E6"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          >
            <line
              x1="40"
              y1="50"
              x2="420"
              y2="50"
            />

            <line
              x1="40"
              y1="120"
              x2="420"
              y2="120"
            />

            <line
              x1="40"
              y1="200"
              x2="420"
              y2="200"
            />

            <line
              x1="40"
              y1="280"
              x2="420"
              y2="280"
            />

            <line
              x1="100"
              y1="30"
              x2="100"
              y2="300"
            />

            <line
              x1="225"
              y1="30"
              x2="225"
              y2="300"
            />

            <line
              x1="380"
              y1="30"
              x2="380"
              y2="300"
            />
          </g>

          {/* ================================
              CONNECTION PATHS
          ================================= */}

          {PATHS.map((path, idx) => {
            const isPulsing = idx === pulseIndex;

            return (
              <g key={`path-${idx}`}>
                {/* Base line */}

                <path
                  d={path.d}
                  fill="none"
                  stroke={
                    isPulsing
                      ? "url(#activeGradient)"
                      : "url(#pathGradient)"
                  }
                  strokeWidth={
                    isPulsing ? 2 : 1.25
                  }
                  strokeDasharray={
                    isPulsing
                      ? "none"
                      : "4 4"
                  }
                  className="
                    transition-all
                    duration-700
                  "
                />

                {/* Animated traveling signal */}

                {isPulsing && (
                  <motion.circle
                    r="3.5"
                    fill="#18BFC0"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <animateMotion
                      dur="1.8s"
                      repeatCount="indefinite"
                      path={path.d}
                    />
                  </motion.circle>
                )}
              </g>
            );
          })}

          {/* ================================
              NODES
          ================================= */}

          {NODES.map((node) => {
            const isSelected =
              activeNode.id === node.id;

            const isCore =
              node.category === "core";

            return (
              <motion.g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-label={`${node.label}: ${node.status}`}
                className="cursor-pointer group outline-none"
                onClick={() =>
                  setActiveNode(node)
                }
                onMouseEnter={() =>
                  setActiveNode(node)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    setActiveNode(node);
                  }
                }}
                whileHover={{
                  scale: 1.08,
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  transformOrigin: `${node.x}px ${node.y}px`,
                }}
              >
                {/* Glow */}

                {isSelected && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isCore ? 27 : 21}
                    fill={
                      isCore
                        ? "url(#coreGlow)"
                        : "url(#nodeGlow)"
                    }
                    initial={{
                      opacity: 0.3,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: [
                        0.3,
                        0.75,
                        0.3,
                      ],
                      scale: [
                        0.8,
                        1.08,
                        0.8,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Outer Ring */}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCore ? 14 : 10}
                  fill="#FFFFFF"
                  stroke={
                    isSelected
                      ? "#0B9FA3"
                      : "#9CCFCE"
                  }
                  strokeWidth={
                    isSelected ? 2 : 1.2
                  }
                  className="
                    transition-all
                    duration-200
                    group-hover:stroke-[#087E82]
                  "
                />

                {/* Center dot */}

                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isCore ? 5 : 3.5}
                  fill={
                    isSelected
                      ? "#087E82"
                      : isCore
                        ? "#24646A"
                        : "#6E999D"
                  }
                  animate={
                    isSelected
                      ? {
                          scale: [1, 1.25, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />

                {/* Node Label */}

                <text
                  x={node.x}
                  y={
                    node.y +
                    (node.category ===
                    "touchpoint"
                      ? 19
                      : node.category ===
                          "destination"
                        ? -15
                        : 22)
                  }
                  textAnchor="middle"
                  className="
                    font-mono
                    text-[9.5px]
                    fill-[#54777B]
                    tracking-tight
                    font-medium
                    pointer-events-none
                    select-none
                    transition-colors
                    group-hover:fill-[#087E82]
                  "
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* ================================
          TELEMETRY INSPECTOR
      ================================= */}

      <motion.div
        key={activeNode.id}
        initial={{
          opacity: 0,
          y: 5,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          mt-2.5
          p-2.5
          rounded-xl
          bg-[#F3FBFA]/90
          border
          border-[#0B9FA3]/10
          text-xs
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="
                font-semibold
                text-[#163D45]
                tracking-tight
              "
            >
              {activeNode.label}
            </span>

            <span
              className="
                font-mono
                text-[10px]
                text-[#7A999C]
              "
            >
              [{activeNode.category}]
            </span>
          </div>

          <span
            className="
              font-mono
              text-[11px]
              font-medium
              text-[#087E82]
              bg-[#E5F7F6]
              px-2
              py-0.5
              rounded
              border
              border-[#0B9FA3]/10
            "
          >
            {activeNode.status}
          </span>
        </div>

        <div
          className="
            mt-1
            flex
            items-center
            justify-between
            font-mono
            text-[11px]
            text-[#688589]
          "
        >
          <span>Signal Validation:</span>

          <span
            className="
              text-[#315B61]
              font-medium
            "
          >
            {activeNode.metric}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
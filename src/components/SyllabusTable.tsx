"use client";

import React from "react";

interface UnitRow {
  label: string;
  title: string;
  body: string;
}

/**
 * Parse syllabus markdown body into structured units.
 * Handles: "Unit-I:", "Unit-1:", "UNIT-I", "Unit I:" etc.
 */
function parseUnits(markdown: string): { units: UnitRow[]; preamble: string; postamble: string } {
  const lines = markdown.split("\n");
  const unitStart = /^\s*(Unit[\s\-–]*([IVX\d]+))\s*:?\s*(.*)$/i;

  const units: UnitRow[] = [];
  const preambleLines: string[] = [];
  let postambleLines: string[] = [];
  let current: UnitRow | null = null;
  let inUnits = false;
  let doneUnits = false;

  const flush = () => {
    if (current) {
      current.body = current.body.trim();
      units.push(current);
      current = null;
    }
  };

  for (const line of lines) {
    const m = line.match(unitStart);
    // Only treat as a unit header if it looks like a real header (short line)
    if (m && line.trim().length < 120 && !doneUnits) {
      flush();
      inUnits = true;
      current = { label: m[1].trim(), title: (m[3] || "").trim(), body: "" };
    } else if (inUnits && current) {
      // End units section when we hit Textbooks / Suggested Readings / Course Outcome
      if (/^\s*(Textbooks|Suggested\s+Readings?|Reference\s+Books?|Course\s+Outcome)\s*:?\s*$/i.test(line)) {
        flush();
        doneUnits = true;
        inUnits = false;
        postambleLines.push(line);
      } else {
        current.body += (current.body ? "\n" : "") + line;
      }
    } else if (!inUnits && !doneUnits) {
      preambleLines.push(line);
    } else {
      postambleLines.push(line);
    }
  }
  flush();

  return {
    units,
    preamble: preambleLines.join("\n").trim(),
    postamble: postambleLines.join("\n").trim(),
  };
}

function renderInline(text: string): React.ReactNode[] {
  // minimal inline: split on newlines -> <br/>, keep text as-is
  return text.split("\n").map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </React.Fragment>
  ));
}

export default function SyllabusTable({ markdown }: { markdown: string }) {
  const { units, preamble, postamble } = React.useMemo(() => parseUnits(markdown), [markdown]);

  if (units.length === 0) {
    // Fallback: no units detected, render raw text
    return <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{markdown}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {preamble && (
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          {renderInline(preamble)}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <table className="w-full text-left border-collapse text-[15px]">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-800/60">
              <th className="px-4 py-3 font-bold w-28 shrink-0 border-b border-neutral-200 dark:border-neutral-700 align-top">
                Unit
              </th>
              <th className="px-4 py-3 font-bold border-b border-neutral-200 dark:border-neutral-700 align-top">
                Topics
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/60">
            {units.map((u, i) => (
              <tr key={i} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/20 transition-colors">
                <td className="px-4 py-3 font-bold whitespace-nowrap align-top text-neutral-900 dark:text-neutral-100">
                  {u.label}
                </td>
                <td className="px-4 py-3 align-top text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {u.title && <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{u.title}</div>}
                  {u.body && <div className="whitespace-pre-wrap">{renderInline(u.body)}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {postamble && (
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
          {renderInline(postamble)}
        </div>
      )}
    </div>
  );
}

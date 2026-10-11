import React, { useEffect, useState } from 'react';
import { SELECTED_WORK } from '../data';
import { CaseStudyItem } from '../types';
import { ArrowUpRight, BarChart3, Globe2, Layers } from 'lucide-react';
import { api } from '../lib/api';
import { resolveIcon } from '../lib/icons';
import { useRouter } from '../context/RouterContext';

interface WorkProps {
  onSelectCaseStudy: (caseStudy: CaseStudyItem) => void;
}

const ICONS = [BarChart3, Globe2, Layers];

export const Work: React.FC<WorkProps> = ({ onSelectCaseStudy }) => {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<CaseStudyItem[]>(SELECTED_WORK);

  useEffect(() => {
    let mounted = true;
    api.getProjects().then((list) => {
      if (mounted) setProjects(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Home shows the projects marked "featured". If none are, show the first 3.
  const featured = projects.filter((p) => p.featured !== false);
  const shown = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section id="work" className="py-20 md:py-24 border-t border-slate-200/60 max-w-6xl mx-auto px-6 sm:px-8">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] font-mono font-semibold tracking-wider text-teal-600 uppercase mb-2">
            Featured work
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Selected work
          </h2>
        </div>
        <button type="button" id="view-all-projects" onClick={() => navigate('/projects')} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-700 transition-colors">
          <span>View all projects</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shown.map((item, index) => {
          const Icon = resolveIcon(item.icon, index, ICONS);

          return (
            <article
              key={item.id}
              id={`case-study-${item.id}`}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-4 ring-1 ring-teal-100 group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-5 h-5 text-teal-600" strokeWidth={2} />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  id={`view-case-study-${item.id}`}
                  onClick={() => onSelectCaseStudy(item)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                >
                  <span>View case study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 sm:hidden">
        <button type="button" onClick={() => navigate('/projects')} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-700 transition-colors">
          <span>View all projects</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
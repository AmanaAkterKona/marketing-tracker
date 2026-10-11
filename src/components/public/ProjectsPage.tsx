import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { CaseStudyItem } from '../../types';
import { resolveIcon } from '../../lib/icons';
import { FuturePreviewModal } from '../FuturePreviewModal';
import { Search, ArrowUpRight, Briefcase, BarChart3, Globe2, Layers } from 'lucide-react';

// Logo Image Import (same as Footer)
import logo from '../../assets/logo (2).png';

const DEFAULT_ICONS = [BarChart3, Globe2, Layers];

export const ProjectsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CaseStudyItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'All Projects & Case Studies – Bayezid Mir';

    api.getProjects().then((list) => {
      setProjects(list);
      setLoading(false);
    });
  }, []);

  const q = search.trim().toLowerCase();
  const filtered = projects.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );

  return (
    <div className="min-h-screen bg-[#f7fafa] text-[#0f2d3a] selection:bg-teal-200/60">
      {/* Top Header / Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="group cursor-pointer flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#0f2d3a] transition-transform duration-300 active:scale-95"
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <img
                src={logo}
                alt="BayezidMir Logo"
                className="w-full h-full object-contain brightness-110 contrast-105 filter drop-shadow-[0_2px_10px_rgba(38,199,196,0.25)]"
              />
            </div>

            <span className="group-hover:text-teal-700 transition-colors duration-300 ml-0.5">
              Bayezid<span className="text-teal-600">Mir</span>
            </span>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              onClick={() => navigate('/')}
              className="hover:text-teal-700 transition-colors hidden sm:block"
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="hover:text-teal-700 transition-colors"
            >
              Insights
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="text-teal-700 font-semibold transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => navigate('/#contact')}
              className="hover:text-teal-700 transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <div className="max-w-3xl space-y-4">
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-teal-700 transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-teal-700 font-medium">Projects</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2d3a]">
            All Projects
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Tracking, attribution, and measurement systems I have designed and implemented.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title or tag..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div className="text-xs font-mono text-slate-500 self-center">
            Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 font-mono text-xs">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-3">
            <Briefcase className="w-8 h-8 text-teal-600/60 mx-auto" />
            <h3 className="text-sm font-semibold text-[#0f2d3a]">No projects found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {projects.length === 0 ? 'Projects will appear here soon.' : 'Try a different search term.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => {
              const Icon = resolveIcon(item.icon, index, DEFAULT_ICONS);
              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-4 ring-1 ring-teal-100 group-hover:bg-teal-100 transition-colors">
                      <Icon className="w-5 h-5 text-teal-600" strokeWidth={2} />
                    </div>

                    {item.tags?.length > 0 && (
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
                    )}

                    <h2 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
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
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Bayezid Mir. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-teal-700">
              Home
            </button>
            <button onClick={() => navigate('/insights')} className="hover:text-teal-700">
              Insights
            </button>
            <a href="/sitemap.xml" target="_blank" className="hover:text-teal-700">
              Sitemap
            </a>
          </div>
        </div>
      </footer>

      {/* Case study popup (contact buttons go to the home page contact section) */}
      <FuturePreviewModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        caseStudy={selected}
        contactHref="/#contact"
      />
    </div>
  );
};
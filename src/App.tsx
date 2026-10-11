import React, { useState } from 'react';
import { useRouter } from './context/RouterContext';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Expertise } from './components/Expertise';
import { TechStrip } from './components/TechStrip';
import { Work } from './components/Work';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FuturePreviewModal } from './components/FuturePreviewModal';
import { CaseStudyItem, ExpertiseItem } from './types';

// Insights & Topic Hubs & Article Pages
import { InsightsPage } from './components/public/InsightsPage';
import { TopicHubPage } from './components/public/TopicHubPage';
import { ArticleDetailPage } from './components/public/ArticleDetailPage';
import { ProjectsPage } from './components/public/ProjectsPage';

// Admin CMS Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminArticlesList } from './components/admin/AdminArticlesList';
import { AdminArticleEditor } from './components/admin/AdminArticleEditor';
import { AdminTopics } from './components/admin/AdminTopics';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminExpertise, AdminProjects } from './components/admin/AdminHomeContent';

export default function App() {
  const { route } = useRouter();

  // Homepage modal states
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyItem | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<ExpertiseItem | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const scrollToContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeModal = () => {
    setSelectedCaseStudy(null);
    setSelectedExpertise(null);
    setIsAboutOpen(false);
  };

  // 1. Admin Routing
  if (route.name === 'admin-login') {
    return <AdminLogin />;
  }
  if (route.name === 'admin-dashboard') {
    return <AdminDashboard />;
  }
  if (route.name === 'admin-articles') {
    return <AdminArticlesList />;
  }
  if (route.name === 'admin-article-new') {
    return <AdminArticleEditor />;
  }
  if (route.name === 'admin-article-edit') {
    return <AdminArticleEditor articleId={route.params.id} />;
  }
  if (route.name === 'admin-categories') {
    return <AdminTopics />;
  }
  if (route.name === 'admin-media') {
    return <AdminMedia />;
  }
  if (route.name === 'admin-expertise') {
    return <AdminExpertise />;
  }
  if (route.name === 'admin-projects') {
    return <AdminProjects />;
  }

  // 2. Public Insights Library
  if (route.name === 'insights') {
    return <InsightsPage />;
  }

  // 2b. All Projects page
  if (route.name === 'projects') {
    return <ProjectsPage />;
  }

  // 3. Article Detail Page: /:topicSlug/:articleSlug
  if (route.name === 'article-detail') {
    return (
      <ArticleDetailPage
        topicSlug={route.params.topicSlug}
        articleSlug={route.params.articleSlug}
      />
    );
  }

  // 4. Topic Hub Page: /:topicSlug (e.g. /conversion-tracking)
  if (route.name === 'topic-hub') {
    return <TopicHubPage topicSlug={route.params.topicSlug} />;
  }

  // 5. Default: Minimalist Homepage
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation */}
      <Navbar onTalkClick={scrollToContact} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onTalkClick={scrollToContact} />

        {/* Expertise Section */}
        <Expertise
          onSelectExpertise={(item) => setSelectedExpertise(item)}
        />

        {/* Subtle Technology Strip */}
        <TechStrip />

        {/* Selected Work Section */}
        <Work
          onSelectCaseStudy={(cs) => setSelectedCaseStudy(cs)}
        />

        {/* About Bayezid Section */}
        <About
          onMoreAboutClick={() => setIsAboutOpen(true)}
        />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Interactive Modal for Future Architecture / Case Study Briefs */}
      <FuturePreviewModal
        isOpen={Boolean(selectedCaseStudy || selectedExpertise || isAboutOpen)}
        onClose={closeModal}
        caseStudy={selectedCaseStudy}
        expertise={selectedExpertise}
        isAboutMode={isAboutOpen}
      />
    </div>
  );
}
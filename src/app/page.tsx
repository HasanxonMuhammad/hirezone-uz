import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import TrustedCompanies from '@/components/TrustedCompanies/TrustedCompanies';
import StatsCounter from '@/components/StatsCounter/StatsCounter';
import WhyChooseUs from '@/components/WhyChooseUs/WhyChooseUs';
import IndustriesServed from '@/components/IndustriesServed/IndustriesServed';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import AboutSection from '@/components/AboutSection/AboutSection';
import LatestJobs from '@/components/LatestJobs/LatestJobs';
import Testimonials from '@/components/Testimonials/Testimonials';
import ResumeMaker from '@/components/ResumeMaker/ResumeMaker';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LatestJobs />
      <IndustriesServed />
      <HowItWorks />
      <AboutSection />
      <WhyChooseUs />
      <Testimonials />
      <ResumeMaker />
      <TrustedCompanies />
      <StatsCounter />
      <Footer />
    </main>
  );
}

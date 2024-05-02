import { Faq } from '@/components/home/Faq';
import FeaturesList from '@/components/home/Features';
import Hero from '@/components/home/Hero';
import Promotion from '@/components/home/Promotion';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesList />
      <Promotion />
      <Faq />
    </>
  );
}

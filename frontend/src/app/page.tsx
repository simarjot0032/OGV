'use client';
import { NavbarHome } from '@components/NavbarHome';
import { HeroBackground } from '@components/HeroBackground';
import { ToastContainer } from 'react-toastify';
import '@styles/Home.scss';
import { Title, Paragraph, PrimaryButton, Heading } from '@components';
import { useRouter } from 'next/navigation';
import { FeatureData } from '@data/FeatureData';
import { FeatureCard } from '@components/common/FeatureCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FAQ } from '@components';
import { FAQData } from '@data/FAQ';
import Footer from '@components/Footer';

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="home-page">
      <NavbarHome />
      <div className="hero-container" id="home">
        <HeroBackground />
        <div className="hero-content">
          <Title title="OGV" className="hero-title" />
          <Paragraph
            paragraph="Online Geometry Viewer"
            className="hero-paragraph"
          />
          <PrimaryButton
            label="Get Started"
            className="hero-button"
            onClick={() => {
              router.push('/dashboard/upload');
            }}
          />
        </div>
      </div>
      <div className="home-container">
        <div className="features-container" id="features">
          <Heading title="What We Provide?" className="features-title" />
          <div className="features-cards">
            {FeatureData.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                index={index + 1}
              />
            ))}
          </div>
        </div>
        <div className="how-to-use-container" id="how-to-use">
          <Heading title="How to Use?" className="how-to-use-title" />
          <motion.div
            ref={videoRef}
            className="how-to-use-video-container"
            id="how-to-use"
            style={{ scale }}
          >
            <video
              src={'/how-to-use.mp4'}
              className="how-to-use-video"
              loop
              muted
              autoPlay
            />
          </motion.div>
        </div>
        <div className="faq-container" id="faq">
          <Heading title="Frequently Asked Questions" className="faq-title" />
          <div className="faq-items">
            {FAQData.map((faq) => (
              <FAQ
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

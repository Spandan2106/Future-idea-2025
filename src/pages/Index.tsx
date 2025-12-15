import { HologramEngine } from '@/components/HologramEngine';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Hologram Engine - 3D Particle Visualization</title>
        <meta name="description" content="Interactive 3D hologram particle engine with voice commands, gesture controls, and stunning visual effects. Experience futuristic particle morphing and animations." />
      </Helmet>
      <HologramEngine />
    </>
  );
};

export default Index;

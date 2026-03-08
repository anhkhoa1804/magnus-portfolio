import { DoodleCanvas } from '@/components/project/DoodleCanvas';

export const metadata = {
  title: 'Doodle Classifier — Magnus',
  description: 'Draw anything and watch a QuickDraw-trained ResNet50 guess in real-time.',
};

export default function DoodleClassifierPage() {
  return (
    <div className="container max-w-5xl py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-fg-muted/50 mb-1">AI · Vision</p>
        <h1 className="text-2xl font-heading font-semibold">Doodle Classifier</h1>
      </div>
      <DoodleCanvas />
    </div>
  );
}

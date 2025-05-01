import MultiStageEstimateForm from '../components/MultiStageEstimateForm';

export const metadata = {
  title: 'Get a Project Estimate | HS Web Solutions',
  description: 'Fill out our form to get a detailed estimate for your web development project.',
};

export default function GetEstimatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Get a Project Estimate</h1>
        <p className="text-lg text-center mb-8">
          Fill out the form below to get a detailed estimate for your project. We'll get back to you as soon as possible.
        </p>
        
        <MultiStageEstimateForm />
      </div>
    </div>
  );
} 
import { Layout } from "@/components/layout/Layout";

export default function Legal() {
    return (
        <Layout>
            <div className="container px-4 py-16 max-w-4xl mx-auto">
                <h1 className="text-3xl font-display font-bold mb-8">Terms & Conditions / Privacy Policy</h1>
                <div className="prose prose-lg dark:prose-invert">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <h3>1. Introduction</h3>
                    <p>Welcome to TailorMade. By using our website and services, you agree to these terms.</p>
                    <h3>2. Privacy</h3>
                    <p>We respect your privacy. Your data is used essentially for processing orders and improving your experience.</p>
                    <h3>3. Returns & Alterations</h3>
                    <p>We offer free alterations within 7 days. Returns are accepted only for manufacturing defects.</p>
                    {/* Add more legal text as needed */}
                </div>
            </div>
        </Layout>
    );
}

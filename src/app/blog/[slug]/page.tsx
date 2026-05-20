import { getBlogBySlugAPI } from "@/services/api";
import BlogContent from "@/components/BlogContent";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getBlogBySlugAPI(slug);
    const blog = data.data;
    if (!blog) return { title: "Blog Not Found | CareerPath" };
    
    return {
      title: blog.metaTitle || `${blog.title} | CareerPath Blog`,
      description: blog.metaDescription || blog.description,
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.description,
      },
    };
  } catch {
    return { title: "Blog Post | CareerPath" };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const { data } = await getBlogBySlugAPI(slug);
    const blog = data.data;

    if (!blog) {
      return (
        <main>
          <Navbar />
          <div className="pt-24 text-center py-40">
            <h1 className="text-3xl font-bold text-navy">Blog Not Found</h1>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-primary font-semibold">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
          <Footer />
        </main>
      );
    }

    return <BlogContent blog={blog} />;
  } catch (error) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 text-center py-40">
          <h1 className="text-3xl font-bold text-navy">Error Loading Blog</h1>
          <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-primary font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }
}

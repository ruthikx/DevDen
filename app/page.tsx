import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Map, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
    {/* Hero Section */}
    <GradientHeader
      title="Shape the future of our product"
      subtitle="Feedback Fusion is where your ideas come to life. Suggest features, vote on what matters most, and help us build a product you'll love.">
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/feedback/new">
              Submit Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
            <Link href="/roadmap">
              View Roadmap <Map className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
    </GradientHeader>

    {/* Feature Section */}
    <section>
      <h2 style={{marginBottom: 20, textAlign: "center", fontSize: "20px"}} className="text-3xl font-bold text-center mb-8">How it works</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)",gap: "1rem",}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <MessageSquare className=" h-8 w-8 text-primary mb-2"/>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Share your ideas and suggestions for improving our product.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart className=" h-8 w-8 text-primary mb-2"/>
            <CardTitle>Vote on Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vote on the features you want to see in our product.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Map className=" h-8 w-8 text-primary mb-2"/>
            <CardTitle>Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor the development of your requested features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className=" h-8 w-8 text-primary mb-2"/>
            <CardTitle>See Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              See the impact of your feedback and the features that have been implemented.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
    {/*Stats Section */}

    <section style={{ textAlign: "center" }}>
      <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="inline-grid grid-cols-1 gap-8">
        <div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }} className="text-3xl font-bold">1,324+</div>
          <div className="text-muted-foreground">Total Feedback</div>
        </div>
        <div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }} className="text-3xl font-bold">8,324+</div>
          <div className="text-muted-foreground">Total Votes</div>
        </div>
        <div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }} className="text-3xl font-bold">324+</div>
          <div className="text-muted-foreground">Features Implemented</div>
        </div>
      </div>
    </section>
    </div>
  );
}

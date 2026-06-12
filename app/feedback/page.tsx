import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { Map, PlusIcon } from "lucide-react";
import Link from "next/link";
import { getCategoryDesign } from "../data/category-data";
import { Badge } from "@/components/ui/badge";
import FeedbackList from "@/components/feedback-list";
export default async function FeedbackPage() {
    // Get the userId from cleark auth
    const {userId} = await auth();

    const posts = await prisma.post.findMany({
        include: {
            author: true,
            votes: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    })
    const categories = await prisma.post.groupBy({
        by: ["category"],
        _count: true,
    })
    return (
        <>
            <div className="w-full">
                <GradientHeader title="Community Feedback" subtitle="Share your ideas and feedback with us!">
                    <div className="flex gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            <Link href="/feedback/new">
                            <PlusIcon className="ml-2 h-4 w-4" /> New Feedback 
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                            <Link href="/roadmap">
                            <Map className="ml-2 h-4 w-4" />
                            View Roadmap 
                            </Link>
                        </Button>
                    </div>
                </GradientHeader>
                <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
                     {/* Sidebar */}
                    <aside className="w-full space-y-6 lg:w-72 lg:shrink-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                                <CardDescription>Browse feedback by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {categories.map((cat)=>{
                                        const design = getCategoryDesign(cat.category);
                                        const Icon = design.icon;
                                        return <div key={cat.category} className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${design.light} ${design.border} border`}>
                                                            <Icon className={`h-4 w-4 ${design.text}`}></Icon>
                                                        </div>
                                                        <span className="font-medium text-sm">
                                                            {cat.category}
                                                        </span>
                                                    </div>
                                                    <Badge variant="secondary" className={`${design.light} ${design.text}`}>
                                                        {cat._count}
                                                    </Badge>
                                               </div>
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* main content */}
                    <div className="min-w-0 flex-1">
                        <FeedbackList initialPosts={posts} userId={userId} />
                    </div>
                </div>
            </div>
        </>
    )
}

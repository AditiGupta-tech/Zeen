import * as React from "react";
import { Link } from "react-router-dom";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { Card } from "./Card";
import { Button } from "./Button";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { className?: string }
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

const ProgressSection = () => {
  const progressData = [
    { skill: "Reading Skills", progress: 75 },
    { skill: "Spelling", progress: 60 },
    { skill: "Writing", progress: 45 },
    { skill: "Confidence", progress: 90 },
  ];

  const achievements = [
    { title: "First Word Spelled", icon: "🌟", date: "Yesterday" },
    { title: "Completed Art Therapy", icon: "🎨", date: "2 days ago" },
    { title: "Perfect Pronunciation", icon: "🗣️", date: "3 days ago" },
    { title: "Yoga Master", icon: "🧘", date: "1 week ago" },
  ];

  return (
    <section id="progress" className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-6">
            Your Amazing Progress! 📈
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Look how much you've grown! Every step forward is a reason to celebrate.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Progress Chart */}
          <Card className="p-8 bg-gradient-to-br from-white to-purple-50 border-none shadow-lg">
            <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">
              Your Learning Journey
            </h3>
            <div className="space-y-6">
              {progressData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.skill}</span>
                    <span className="text-sm font-bold text-gray-600">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-3" />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/personalize">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full">
                View Detailed Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-8 bg-gradient-to-br from-white to-orange-50 border-none shadow-lg">
            <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">
              Recent Achievements 🏆
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/personalize">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full"
              >
                See All Achievements
              </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Parent Dashboard Preview */}
        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-blue-100 to-green-100 border-none shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                👨‍👩‍👧‍👦 For Parents & Therapists
              </h3>
              <p className="text-gray-700">
                Separate dashboards to track progress and assign personalized tasks
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/60 border-none">
                <h4 className="font-bold text-blue-800 mb-3">Parent Dashboard</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Monitor your child's progress, set goals, and celebrate achievements together.
                </p>
                <Link to="/personalize">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Access Parent Portal
                </Button>
                </Link>
              </Card>
              <Card className="p-6 bg-white/60 border-none">
                <h4 className="font-bold text-green-800 mb-3">Therapist Dashboard</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Track skills development and assign targeted therapeutic tasks.
                </p>
                <Link to="/personalize">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  Therapist Login
                </Button>
                </Link>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { ArrowRight, Volume2 } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { cn } from "../lib/utils"
import { cva, type VariantProps } from "class-variance-authority";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const AuthSection = () => {
  const [signupData, setSignupData] = React.useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.name && signupData.email && signupData.password) {
      alert(
        `Welcome to Zeen, ${signupData.name}! 🌟 Your magical learning journey begins now!`
      );
      setIsLoggedIn(true);
      setTimeout(() => {
        document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      alert("Welcome back! 👋 Ready to continue your amazing journey?");
      setIsLoggedIn(true);
      setTimeout(() => {
        document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  };

  const handleVoiceSignup = () => {
    const utterance = new SpeechSynthesisUtterance(
      "Hi! I'm Ishaan. Let me help you create your account. What's your name?"
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const handleVoiceLogin = () => {
    const utterance = new SpeechSynthesisUtterance(
      "Welcome back! Let me help you log in. Please tell me your email address."
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  if (isLoggedIn) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-green-600 mb-4">
            Welcome to the Zeen Family!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your account is ready! Let's start your amazing learning adventure.
          </p>
          <Button
            onClick={() =>
              document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg shadow-lg"
          >
            Start Playing Games! 🎮
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 animated-bg relative">
      <div className="stars">
        <div className="star"></div>
        <div className="star"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-6">
            Join the Zeen Family! 🌟
          </h2>
          <p className="text-xl text-gray-600">
            Start your learning adventure today and discover how amazing you are!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* -------- Signup -------- */}
          <Card className="p-8 bg-gradient-to-br from-orange-100 to-orange-200 border-none shadow-lg hover:shadow-xl transition-shadow floating">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-orange-800 mb-2">Create Account</h3>
              <p className="text-orange-700">Start your amazing journey with us!</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label className="text-orange-800 font-medium">Child's Name</Label>
                <Input
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="border-orange-300 focus:border-orange-500 bg-white/80"
                  required
                />
              </div>
              <div>
                <Label className="text-orange-800 font-medium">Parent's Email</Label>
                <Input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  placeholder="parent@example.com"
                  className="border-orange-300 focus:border-orange-500 bg-white/80"
                  required
                />
              </div>
              <div>
                <Label className="text-orange-800 font-medium">Password</Label>
                <Input
                  type="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  placeholder="Create a secure password"
                  className="border-orange-300 focus:border-orange-500 bg-white/80"
                  required
                />
              </div>
              <div>
                <Label className="text-orange-800 font-medium">Age</Label>
                <Input
                  type="number"
                  value={signupData.age}
                  onChange={(e) =>
                    setSignupData({ ...signupData, age: e.target.value })
                  }
                  placeholder="Child's age"
                  className="border-orange-300 focus:border-orange-500 bg-white/80"
                />
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full shadow-lg btn-magical"
                >
                  Create My Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVoiceSignup}
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 py-3 rounded-full btn-magical"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Sign Up with Voice
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-100 to-blue-200 border-none shadow-lg hover:shadow-xl transition-shadow floating">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Welcome Back!</h3>
              <p className="text-blue-700">Continue your learning adventure</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-blue-800 font-medium">Email</Label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="border-blue-300 focus:border-blue-500 bg-white/80"
                  required
                />
              </div>
              <div>
                <Label className="text-blue-800 font-medium">Password</Label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="border-blue-300 focus:border-blue-500 bg-white/80"
                  required
                />
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-full shadow-lg btn-magical"
                >
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVoiceLogin}
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 py-3 rounded-full btn-magical"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Login with Voice
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline">
                    Forgot your password?
                  </a>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-green-100 to-purple-100 border-none shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                📊 Track Your Amazing Progress!
              </h3>
              <p className="text-gray-700 mb-6">
                Once you sign up, you'll get your own special progress dashboard where you can see:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <p className="font-semibold text-green-800">Achievements Earned</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <p className="font-semibold text-blue-800">Skills Improvement</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎮</div>
                  <p className="font-semibold text-purple-800">Games Completed</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;

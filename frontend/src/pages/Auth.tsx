
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Mail, Lock, User, Phone } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '' 
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login(loginData);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: "ROLE_USER" // Backend expects ROLE_USER format
      });
      
      // Registration successful
      toast({
        title: "Account created successfully!",
        description: `Welcome to KIIT Finder, ${result.user.name}! You can now start reporting items.`,
        variant: "default",
      });
      
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="bg-gradient-hero">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
          {/* Welcome heading */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome to<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                KIIT Finder!
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-primary" />
              <span>Trusted by 120+ KIIT students</span>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto rounded-full p-1.5 bg-white border border-primary/20 shadow-gentle">
                <TabsTrigger
                  value="login"
                  className="rounded-full py-2.5 font-medium text-primary transition-all hover:bg-accent/60 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-gentle"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-full py-2.5 font-medium text-primary transition-all hover:bg-accent/60 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-gentle"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="mt-6">
                <Card className="card-soft overflow-hidden border border-primary/20 shadow-soft rounded-[2rem]">
                  <CardHeader className="text-center bg-gradient-hero border-b border-primary/10 pb-6">
                    <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                    <CardDescription>
                      Enter your details to access your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="rollnumber@kiit.ac.in"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="mt-6">
                <Card className="card-soft overflow-hidden border border-primary/20 shadow-soft rounded-[2rem]">
                  <CardHeader className="text-center bg-gradient-hero border-b border-primary/10 pb-6">
                    <CardTitle className="text-2xl">Join Our Community!</CardTitle>
                    <CardDescription>
                      Create your account to start helping others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="rollnumber@kiit.ac.in"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="1234567890"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-10 h-12 rounded-2xl bg-white border-primary/25 focus-visible:border-primary focus-visible:ring-primary/30"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">terms of service</a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">data policy</a>.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      </div>

      <Footer />
    </div>
  );
};

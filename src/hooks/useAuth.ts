import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, SignupVariables, LoginVariables } from '@/services/auth.service';

export const useSignup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: SignupVariables) => authService.signup(variables),
    onSuccess: () => {
      // Invalidate and refetch any user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Signup error:', error);
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: LoginVariables) => authService.login(variables),
    onSuccess: () => {
      // Invalidate and refetch any user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Redirect to home
      router.push('/');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity, // User data doesn't change often
  });
};

export const useAuth = () => {
  const { data: user, isLoading } = useCurrentUser();
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import type { User } from '@/types/user';

// function generateToken(): string {
//   const arr = new Uint8Array(12);
//   window.crypto.getRandomValues(arr);
//   return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
// }

// export interface SignUpParams {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ConfirmCodeParams {
  email: string;
  code: string;
}
export interface DecodedToken {
  user_id: string;
}

export interface UpdatePasswordParams {
  email: string;
  password: string;
  confirmPassword: string;
}
export interface ChangePasswordParams {
  email: string;
  OldPassword: string;
  NewPassword: string;
  // confirmPassword: string;
}

class AuthClient {
  // async signUp(_: SignUpParams): Promise<{ error?: string }> {
  //   // Make API request

  //   // We do not handle the API, so we'll just generate a token and store it in localStorage.
  //   const token = generateToken();
  //   localStorage.setItem('custom-auth-token', token);

  //   return {};
  // }

  // async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
  //   return { error: 'Social authentication not implemented' };
  // }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    // debugger
    const { email, password } = params;
    try {
      // debugger
      const response = await axios.post<{ token: string }>('https://localhost:7098/api/Login/login', {
        email,
        password,
      });
      if (response.status !== 200) {
        return { error: 'Invalid credentials status' };
      }
      const token = response.data.token;
      localStorage.setItem('employee-auth-token', token);
      // console.log(token)
      return {};
    } catch (error) {
      return { error: 'Invalid credentials' };
    }
  }

  async forgotPassword(params: ForgotPasswordParams): Promise<{ error?: string }> {
    // debugger
    const { email } = params;
    try {
      // debugger
      const response = await axios.post('https://localhost:7098/api/ForgotPassword/forgotpassword', {
        email: email,
      });

      if (response.status === 200) {
        // console.log('Response:', response);
        return {};
      } else {
        return { error: 'Password reset request failed' };
      }
    } catch (error) {
      // console.error('Password reset error:', error);
      return { error: 'An error occurred while resetting password' };
    }
  }

  async confirmCode(params: ConfirmCodeParams): Promise<{ error?: string }> {
    const { email, code } = params;
    try {
      const response = await axios.post('https://localhost:7098/api/ForgotPassword/confirmcode', {
        email: email,
        code: code,
      });
      if (response.status === 200) {
        return {};
      } else {
        return { error: 'code request failed' };
      }
    } catch (error) {
      return { error: 'An error occurred whileS code' };
    }
  }

  async updatePassword(params: UpdatePasswordParams): Promise<{ error?: string }> {
    // debugger
    const { email, password, confirmPassword } = params;
    try {
      const response = await axios.post('https://localhost:7098/api/ForgotPassword/resetpassword', {
        email,
        newPassword: password,
        confirmPassword,
      });
      if (response.status === 200) {
        return {};
      } else {
        return { error: 'Password reset request failed' };
      }
    } catch (error) {
      return { error: 'An error occurred while resetting the password' };
    }
  }

  async changePassword(params: ChangePasswordParams): Promise<{ error?: string }> {
    const { email, OldPassword, NewPassword } = params;
    try {
      const response = await axios.post('https://localhost:7098/api/Login/change-password', {
        email,
        OldPassword,
        NewPassword,
        // confirmPassword,
      });
      if (response.status === 200) {
        return {};
      } else {
        return { error: 'Password change request failed' };
      }
    } catch (error) {
      return { error: 'An error occurred while resetting the password' };
    }
  }

  // async getUser(): Promise<{ data?: User | null; error?: string }> {
  //   try {
  //     const token = localStorage.getItem('employee-auth-token');
  //     // console.log(token);
  //     if (!token) {
  //       return { data: null };
  //     }
  //     // console.log(token)
  //     const decodedToken = jwtDecode(token) as DecodedToken;
  //     console.log(decodedToken)
  //     const userIdFromToken = decodedToken.user_id;
  //     console.log(userIdFromToken)
  //     return {};
  //   } catch (error) {
  //     // console.error('Failed to fetch user data:', error);
  //     return { error: 'Failed to fetch user data' };
  //   }
  // }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const token = localStorage.getItem('employee-auth-token');
      if (!token) {
        return { data: null, error: 'User not logged in' };
      }
      const decodedToken = jwtDecode(token) as DecodedToken;
      const userIdFromToken = decodedToken.user_id;

      if (!userIdFromToken) {
        return { data: null, error: 'userid is invalid' };
      }
      let url = `https://localhost:7098/api/Staff/by-id/${userIdFromToken}`;

      const response = await axios.get<User>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response?.data;
      if (!responseData) {
        return { data: null, error: 'No user data found' };
      }

      return { data: response.data, error: undefined };
    } catch (error) {
      return { data: null, error: 'Failed to fetch user data' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('employee-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();

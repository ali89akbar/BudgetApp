import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login'; // Importing the Login component from the current directory

// Mock SignInForm and SignUpForm since they aren't the focus of this test
jest.mock('./SignInForm', () => () => <div>Mock Sign In Form</div>);
jest.mock('./SignUpForm', () => () => <div>Mock Sign Up Form</div>);

describe('Login component', () => {
  test('renders SignIn form by default', () => {
    render(<Login />);
    
    // Check that the SignIn form is rendered by default
    expect(screen.getByText('Mock Sign In Form')).toBeInTheDocument();
  });

  test('switches to SignUp form on Sign Up button click', () => {
    render(<Login />);
    
    // Simulate a click on the 'Sign Up' button
    fireEvent.click(screen.getByText('Sign Up'));

    // Check that the SignUp form is rendered after the button click
    expect(screen.getByText('Mock Sign Up Form')).toBeInTheDocument();
  });

  test('switches back to SignIn form on Sign In button click', () => {
    render(<Login />);
    
    // Simulate clicking the 'Sign Up' button to switch to the sign-up form first
    fireEvent.click(screen.getByText('Sign Up'));

    // Simulate clicking the 'Sign In' button to switch back to the sign-in form
    fireEvent.click(screen.getByText('Sign In'));

    // Check that the SignIn form is rendered again
    expect(screen.getByText('Mock Sign In Form')).toBeInTheDocument();
  });

  test('renders overlay content for non-mobile view', () => {
    render(<Login />);

    // Check that the overlay content (for larger screens) is present
    expect(screen.getByText('Welcome to Budget Tracker App')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('handles window resize and switches to mobile view', () => {
    render(<Login />);

    // Trigger a window resize to a mobile view (less than or equal to 768px)
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    // Verify that the overlay content disappears in mobile view
    expect(screen.queryByText('Welcome to Budget Tracker App')).not.toBeInTheDocument();
  });
});
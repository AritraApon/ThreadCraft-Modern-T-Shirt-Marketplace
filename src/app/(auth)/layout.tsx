import Navbar from '@/Components/Layout/Navbar';
import React from 'react';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <div>
          <Navbar/>
                <main>{children}</main>
        </div>
    );
};

export default DashboardLayout;
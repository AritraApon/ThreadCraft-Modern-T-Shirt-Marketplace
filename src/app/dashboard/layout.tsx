import React from 'react';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <div>
                <main>{children}</main>
        </div>
    );
};

export default DashboardLayout;
'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from './ui/sidebar';

const Navbar = () => {
  const pathname = usePathname();
  
  // Helper function to generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    
    const breadcrumbs = [];
    let accumulatedPath = '';
    
    for (const segment of segments) {
      accumulatedPath += `/${segment}`;
      const formattedSegment = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      breadcrumbs.push({
        href: accumulatedPath,
        title: formattedSegment
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem className={!isLast ? 'hidden md:block' : ''}>
                    {!isLast ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Navbar;
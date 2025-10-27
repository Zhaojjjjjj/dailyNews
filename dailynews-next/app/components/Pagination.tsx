'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [currentPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= showPages; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - showPages + 1; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination" ref={paginationRef}>
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span>←</span>
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>→</span>
      </button>
    </div>
  );
}


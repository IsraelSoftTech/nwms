// Search utility functions
export const searchReports = (reports, searchTerm) => {
    if (!searchTerm) return reports;
    
    const term = searchTerm.toLowerCase().trim();
    return reports.filter(report => {
      return (
        report.type?.toLowerCase().includes(term) ||
        report.description?.toLowerCase().includes(term) ||
        report.location?.toLowerCase().includes(term) ||
        report.user?.toLowerCase().includes(term) ||
        report.date?.toLowerCase().includes(term)
      );
    });
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  export const formatSearchResults = (results) => {
    return results.map(result => ({
      id: result.id,
      type: result.type,
      location: result.location,
      date: result.date,
      user: result.user,
      description: result.description
    }));
  };
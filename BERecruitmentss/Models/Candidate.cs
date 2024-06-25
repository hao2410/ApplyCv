using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BERecruitmentss.Models
{
    public class Candidate :Base
    {
        public string? CandidateCode { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateCreated { get; set; }
        public string? Cv { get; set; }
        public int? Status { get; set; }
        public virtual ICollection<RecruitmentApplicant>? RecruitmentApplicant { get; set; }
    }
  
}

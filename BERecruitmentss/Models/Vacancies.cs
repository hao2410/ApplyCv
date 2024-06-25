using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BERecruitmentss.Models
{
    public class Vacancies:Base
    {
        public string? RecruitmentCode { get; set; }
        public int? Status { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public int? Department { get; set; }
        public DateTime? RecruitmentClosingDate { get; set; }
        public int? StaffID { get; set; }
        [ForeignKey("StaffID")]
        public virtual Staff? Staff { get; set; }

        public virtual ICollection<RecruitmentApplicant>? RecruitmentApplicant { get; set; }
    }

}

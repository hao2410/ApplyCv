using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BERecruitmentss.Models
{
    public class Staff : Base
    {
        public string? EmployeeCode { get; set; }
        public string? StaffName { get; set; }
        public string? Password { get; set; }
        public int? Role { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        public virtual ICollection<Vacancies>? Vacancies { get; set; }
    }


}
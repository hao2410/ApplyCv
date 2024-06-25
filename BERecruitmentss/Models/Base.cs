using System.ComponentModel.DataAnnotations;

namespace BERecruitmentss.Models
{
    public class Base
    {
        [Key]
        public int Id { get; set; }
        public DateTime? StartedDate { get; set; } = DateTime.Now;
        public string? StartedBy { get; set; } = "";
        public DateTime? EndedDate { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; } = "";
        public bool? IsDeleted { get; set; } = null;
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; } = "";

    }
}

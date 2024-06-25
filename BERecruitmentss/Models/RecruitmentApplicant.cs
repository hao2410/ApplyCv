using System.ComponentModel.DataAnnotations.Schema;

namespace BERecruitmentss.Models
{
    public class RecruitmentApplicant : Base
    {
        public DateTime? DateStart { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Status { get; set; }
        public int? CandidateId { get; set; }
        public int? VacanciesId { get; set; }
        [ForeignKey("CandidateId")]
        public virtual Candidate? Candidate { get; set; }
        [ForeignKey("VacanciesId")]
        public virtual Vacancies? Vacancies { get; set; }

    }
}

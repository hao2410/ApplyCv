namespace BERecruitmentss.Common
{
    public class CandidateRADto
    {
        public int? CandidateId { get; set; }
        public int? RecruitmentApplicantId { get; set; }
        public DateTime? RecruitmentApplicantDateStart { get; set; }
        public DateTime? RecruitmentApplicantEndDate { get; set; }
        public int? RecruitmentApplicantStatus { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }

    }
}

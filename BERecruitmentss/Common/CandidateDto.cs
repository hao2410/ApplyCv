namespace BERecruitmentss.Common
{
    public class CandidateDto
    {
        public int?  CandidateId { get; set; }
        public string? CandidateCode { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string Phone { get; set; }
        public DateTime? DateCreated { get; set; }
        public string? Cv { get; set; }
        public int? Status { get; set; }
        public int? RecruitmentApplicantId { get; set; }
        public DateTime? RecruitmentApplicantDateStart { get; set; }
        public DateTime? RecruitmentApplicantEndDate { get; set; }
        public int? RecruitmentApplicantStatus { get; set; }
        public int? VacanciesId { get; set; }
        public string? VacanciesRecruitmentCode { get; set; }
        public string? VacanciesTitle { get; set; }
        public string? VacanciesDescription { get; set; }
        public int? VacanciesQuantity { get; set; }
        public DateTime? VacanciesRecruitmentClosingDate { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BERecruitmentss.Models;

namespace BERecruitmentss.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            this.SeedData();
        }
        public virtual DbSet<Staff> Staff { get; set; }
        public virtual DbSet<Vacancies> Vacancies { get; set; }        
        public virtual DbSet<RecruitmentApplicant> RecruitmentApplicant { get; set; }
        public virtual DbSet<Candidate> Candidate { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Candidate>()
                .HasIndex(s => s.CandidateCode)
                .IsUnique();
            modelBuilder.Entity<Staff>()
             .HasIndex(s => s.Email)
             .IsUnique();
            modelBuilder.Entity<Staff>()
           .HasIndex(s => s.EmployeeCode)
           .IsUnique();
            modelBuilder.Entity<Vacancies>()
               .HasIndex(s => s.RecruitmentCode)
               .IsUnique();

        }
        private async void SeedData()
        {
            //if (this.Users.Count() <= 0)
            //{
            //    var u1 = new Users() { Phone = "123456789", Dob = new DateTime(1990, 5, 15), Email = "user1@example.com", Address = "123 Street, City", Role = 1 };
            //    var u2 = new Users() { Phone = "987654321", Dob = new DateTime(1985, 10, 20), Email = "user2@example.com", Address = "456 Road, Town", Role = 2 };
            //    var u3 = new Users() { Phone = "456789123", Dob = new DateTime(1995, 3, 25), Email = "user3@example.com", Address = "789 Avenue, Village", Role = 3 };
            //    var u4 = new Users() { Phone = "321654987", Dob = new DateTime(1980, 7, 10), Email = "user4@example.com", Address = "987 Lane, District", Role = 1 };
            //    var u5 = new Users() { Phone = "654321789", Dob = new DateTime(1992, 11, 30), Email = "user5@example.com", Address = "246 Boulevard, County", Role = 2 };
            //    this.Users.Add(u1);
            //    this.Users.Add(u2);
            //    this.Users.Add(u3);
            //    this.Users.Add(u4);
            //    this.Users.Add(u5);

            //    this.SaveChanges();
            //}
            if (this.Staff.Count() <= 0)
            {
                var s1 = new Staff() { EmployeeCode = "V1001", StaffName = "son123", Password = "123456", Role = 1, Email = "son.bh.2216@aptechlearning.edu.vn" };
                var s2 = new Staff() { EmployeeCode = "V1002", StaffName = "Jane Smith", Password = "password456", Role = 2, Email = "jane@example.com" };
                var s3 = new Staff() { EmployeeCode = "V1003", StaffName = "Alice Johnson", Password = "password789", Role = 3, Email = "alice@example.com" };
                var s4 = new Staff() { EmployeeCode = "V1004", StaffName = "Bob Brown", Password = "passwordabc", Role = 1, Email = "bob@example.com" };
                var s5 = new Staff() { EmployeeCode = "V1005", StaffName = "Eva Martinez", Password = "passworddef", Role = 2, Email = "eva@example.com" };

                this.Staff.Add(s1);
                this.Staff.Add(s2);
                this.Staff.Add(s3);
                this.Staff.Add(s4);
                this.Staff.Add(s5);

                this.SaveChanges();
            }
            if (this.Vacancies.Count() <= 0)
            {
                var v1 = new Vacancies() { RecruitmentCode = "A1101", Status = 1, Title = "Software Engineer", Description = "Join our development team", Quantity = 5, Department = 1, RecruitmentClosingDate = new DateTime(2024, 6, 30), StaffID = 1 };
                var v2 = new Vacancies() { RecruitmentCode = "A1102", Status = 2, Title = "Marketing Manager", Description = "Lead our marketing efforts", Quantity = 2, Department = 2, RecruitmentClosingDate = new DateTime(2024, 7, 15), StaffID = 2 };
                var v3 = new Vacancies() { RecruitmentCode = "A1103", Status = 1, Title = "Data Analyst", Description = "Analyze and interpret data", Quantity = 3, Department = 3, RecruitmentClosingDate = new DateTime(2024, 7, 31), StaffID = 3 };
                var v4 = new Vacancies() { RecruitmentCode = "A1104", Status = 2, Title = "HR Coordinator", Description = "Manage human resource activities", Quantity = 1, Department = 4, RecruitmentClosingDate = new DateTime(2024, 8, 15), StaffID = 4 };
                var v5 = new Vacancies() { RecruitmentCode = "A1105", Status = 1, Title = "Sales Representative", Description = "Promote and sell our products", Quantity = 4, Department = 5, RecruitmentClosingDate = new DateTime(2024, 8, 31), StaffID = 5 };

                this.Vacancies.Add(v1);
                this.Vacancies.Add(v2);
                this.Vacancies.Add(v3);
                this.Vacancies.Add(v4);
                this.Vacancies.Add(v5);

                this.SaveChanges();
            }
            if (this.Candidate.Count() <= 0)
            {
                var c1 = new Candidate() { CandidateCode = "C1001", Name = "Candidate 1",Email="thao123@gmail.com",Phone="0999898989", DateCreated = new DateTime(1990, 5, 15), Status = 1 };
                var c2 = new Candidate() { CandidateCode = "C1002", Name = "Candidate 2", Email = "thao1223@gmail.com", Phone = "0999898989", DateCreated = new DateTime(1985, 10, 20), Status = 2 };
                var c3 = new Candidate() { CandidateCode = "C1003", Name = "Candidate 3", Email = "thao1234@gmail.com", Phone = "0999898989", DateCreated = new DateTime(1995, 3, 25), Status = 1 };
                var c4 = new Candidate() { CandidateCode = "C1004", Name = "Candidate 4", Email = "thao1231@gmail.com", Phone = "0999898989", DateCreated = new DateTime(1980, 7, 10), Status = 2 };
                var c5 = new Candidate() { CandidateCode = "C1005", Name = "Candidate 5", Email = "thao1232@gmail.com", Phone = "0999898989", DateCreated = new DateTime(1992, 11, 30), Status = 1 };
                this.Candidate.Add(c1);
                this.Candidate.Add(c2);
                this.Candidate.Add(c3);
                this.Candidate.Add(c4);
                this.Candidate.Add(c5);

                this.SaveChanges();
            }
            if (this.RecruitmentApplicant.Count() <= 0)
            {
                var ra1 = new RecruitmentApplicant() { DateStart = new DateTime(2024, 5, 15), EndDate = new DateTime(2024, 6, 15), Status = 1, CandidateId = 1, VacanciesId = 1 };
                var ra2 = new RecruitmentApplicant() { DateStart = new DateTime(2024, 6, 20), EndDate = new DateTime(2024, 7, 20), Status = 2, CandidateId = 2, VacanciesId = 2 };
                var ra3 = new RecruitmentApplicant() { DateStart = new DateTime(2024, 7, 25), EndDate = new DateTime(2024, 8, 25), Status = 1, CandidateId = 3, VacanciesId = 3 };
                var ra4 = new RecruitmentApplicant() { DateStart = new DateTime(2024, 8, 10), EndDate = new DateTime(2024, 9, 10), Status = 2, CandidateId = 4, VacanciesId = 4 };
                var ra5 = new RecruitmentApplicant() { DateStart = new DateTime(2024, 9, 30), EndDate = new DateTime(2024, 10, 30), Status = 1, CandidateId = 5, VacanciesId = 5 };
                this.RecruitmentApplicant.Add(ra1);
                this.RecruitmentApplicant.Add(ra2);
                this.RecruitmentApplicant.Add(ra3);
                this.RecruitmentApplicant.Add(ra4);
                this.RecruitmentApplicant.Add(ra5);
                this.SaveChanges();
            }
        }
    }
}
using BERecruitmentss.Data;
using BERecruitmentss.Models;

namespace BERecruitmentss.Repository
{
    public interface IRecruitmentApplicantRepository : IBaseRepository<RecruitmentApplicant>
    {
        Task<RecruitmentApplicant> AddAsync(RecruitmentApplicant entity);
        Task<RecruitmentApplicant> GetByIdAsync(int id);
    }

    public class RecruitmentApplicantRepository : BaseRepository<RecruitmentApplicant>, IRecruitmentApplicantRepository
    {
        public RecruitmentApplicantRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor) : base(context, httpContextAccessor)
        {
        }

        public async Task<RecruitmentApplicant> AddAsync(RecruitmentApplicant entity)
        {
            if (entity != null)
            {
                _dbSet.Add(entity);
                await _context.SaveChangesAsync();
                return entity;
            }
            return null;
        }

        public async Task<RecruitmentApplicant> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using BERecruitmentss.Common;
using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using System.Linq.Expressions;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<T> : ControllerBase where T : Base
    {
        private readonly IBaseRepository<T> _repository;

        public BaseController(IBaseRepository<T> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult<List<T>>> GetAll()
        {
            var result = await _repository.GetAllNoPagAndFilter();
            return Ok(result);
        }

        [HttpPost]
        [Route("fullFilter")]
        public async Task<ActionResult<List<T>>> FullFilter([FromBody] FiterRequestDTO requestDTO)
        {
            var result = await _repository.FullFilter_1(requestDTO);
            return Ok(result);
        }

        [HttpGet("by-id/{id}")]
        public async Task<ActionResult<T>> GetById(int id)
        {
            var result = await _repository.GetById(id);
            return Ok(result);
        }

        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<T>> GetByEmail(string email)
        {
            var result = await _repository.GetByEmail(email);
            return Ok(result);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<T>> Create(T entity)
        {
            var result = await _repository.Create(entity);
            return Ok(result);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<ActionResult<T>> Update(int id, [FromBody] T entity)
        {
            if (entity == null)
            {
                return BadRequest("Dữ liệu cập nhật không hợp lệ");
            }

            var result = await _repository.Update(id, entity);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }


        [HttpDelete]


        public async Task<ActionResult<T>> Delete(int id)
        {
            var result = await _repository.Delete(id);
            return Ok(result);
        }

        private Expression<Func<T, object>> CreatePropertyExpression(string propertyName)
        {
            var param = Expression.Parameter(typeof(T), "e");
            var body = Expression.Convert(Expression.Property(param, propertyName), typeof(object));
            return Expression.Lambda<Func<T, object>>(body, param);
        }
    }
}

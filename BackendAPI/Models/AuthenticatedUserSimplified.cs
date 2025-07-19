namespace BackendAPI.Models
{
    public class AuthenticatedUserSimplified
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;
    }
}
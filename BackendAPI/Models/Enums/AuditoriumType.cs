using System.Runtime.Serialization;

namespace BackendAPI.Models.Enums
{
    public enum AuditoriumType
    {
        [EnumMember(Value = "Classic")]
        Classic,
        [EnumMember(Value = "IMAX")]
        IMAX,
        [EnumMember(Value = "4DX")]
        FourDX
    }
}
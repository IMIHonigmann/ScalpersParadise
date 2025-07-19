using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Models;

public partial class ScalpersParadiseContext : DbContext
{
    public ScalpersParadiseContext()
    {
    }

    public ScalpersParadiseContext(DbContextOptions<ScalpersParadiseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Auditorium> Auditoriums { get; set; }

    public virtual DbSet<Auditoriumprice> Auditoriumprices { get; set; }

    public virtual DbSet<DistinctMovieid> DistinctMovieids { get; set; }

    public virtual DbSet<Screening> Screenings { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<Seatprice> Seatprices { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userbalance> Userbalances { get; set; }

    public virtual DbSet<Userreservation> Userreservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auditorium>(entity =>
        {
            entity.HasKey(e => e.AuditoriumId).HasName("auditoriums_pkey");

            entity.ToTable("auditoriums");

            entity.Property(e => e.AuditoriumId)
                .ValueGeneratedNever()
                .HasColumnName("auditorium_id");
            entity.Property(e => e.AuditoriumType)
                .HasColumnType("character varying")
                .HasColumnName("auditorium_type");

            entity.HasOne(d => d.AuditoriumTypeNavigation).WithMany(p => p.Auditoria)
                .HasForeignKey(d => d.AuditoriumType)
                .HasConstraintName("fk_auditoriums_auditoriumprices");
        });

        modelBuilder.Entity<Auditoriumprice>(entity =>
        {
            entity.HasKey(e => e.AuditoriumType).HasName("auditoriumprices_pkey");

            entity.ToTable("auditoriumprices");

            entity.Property(e => e.AuditoriumType)
                .HasColumnType("character varying")
                .HasColumnName("auditorium_type");
            entity.Property(e => e.Price).HasColumnName("price");
        });

        modelBuilder.Entity<DistinctMovieid>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("distinct_movieids");

            entity.Property(e => e.MovieId).HasColumnName("movie_id");
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("screenings_pkey");

            entity.ToTable("screenings");

            entity.Property(e => e.ScreeningId)
                .ValueGeneratedNever()
                .HasColumnName("screening_id");
            entity.Property(e => e.AuditoriumId).HasColumnName("auditorium_id");
            entity.Property(e => e.DynamicPricingModifier).HasColumnName("dynamic_pricing_modifier");
            entity.Property(e => e.MovieId).HasColumnName("movie_id");
            entity.Property(e => e.ScreeningTime)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("screening_time");

            entity.HasOne(d => d.Auditorium).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.AuditoriumId)
                .HasConstraintName("screenings_auditorium_id_fkey");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("seats_pkey");

            entity.ToTable("seats");

            entity.Property(e => e.SeatId)
                .ValueGeneratedNever()
                .HasColumnName("seat_id");
            entity.Property(e => e.AuditoriumId).HasColumnName("auditorium_id");
            entity.Property(e => e.RowNumber).HasColumnName("row_number");
            entity.Property(e => e.SeatNumber).HasColumnName("seat_number");
            entity.Property(e => e.SeatType).HasColumnName("seat_type");

            entity.HasOne(d => d.Auditorium).WithMany(p => p.Seats)
                .HasForeignKey(d => d.AuditoriumId)
                .HasConstraintName("seats_auditorium_id_fkey");

            entity.HasOne(d => d.SeatTypeNavigation).WithMany(p => p.Seats)
                .HasForeignKey(d => d.SeatType)
                .HasConstraintName("fk_seats_seatprices");
        });

        modelBuilder.Entity<Seatprice>(entity =>
        {
            entity.HasKey(e => e.SeatType).HasName("seatprices_pkey");

            entity.ToTable("seatprices");

            entity.Property(e => e.SeatType).HasColumnName("seat_type");
            entity.Property(e => e.PriceModifier).HasColumnName("price_modifier");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Username).HasColumnName("username");
        });

        modelBuilder.Entity<Userbalance>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("userbalances_pkey");

            entity.ToTable("userbalances");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("user_id");
            entity.Property(e => e.Balance).HasColumnName("balance");

            entity.HasOne(d => d.User).WithOne(p => p.Userbalance)
                .HasForeignKey<Userbalance>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("userbalances_user_id_fkey");
        });

        modelBuilder.Entity<Userreservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("userreservations_pkey");

            entity.ToTable("userreservations");

            entity.Property(e => e.ReservationId).HasColumnName("reservation_id");
            entity.Property(e => e.BoughtAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("bought_at");
            entity.Property(e => e.PricePaid).HasColumnName("price_paid");
            entity.Property(e => e.ScreeningId).HasColumnName("screening_id");
            entity.Property(e => e.SeatId).HasColumnName("seat_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Screening).WithMany(p => p.Userreservations)
                .HasForeignKey(d => d.ScreeningId)
                .HasConstraintName("userreservations_screening_id_fkey");

            entity.HasOne(d => d.Seat).WithMany(p => p.Userreservations)
                .HasForeignKey(d => d.SeatId)
                .HasConstraintName("userreservations_seat_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Userreservations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("userreservations_user_id_fkey");
        });
        modelBuilder.HasSequence("userreservations_reservation_id_seq");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

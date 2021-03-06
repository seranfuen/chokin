USE [master]
GO
/****** Object:  Database [Chokin_DEV]    Script Date: 26/11/2016 20:11:01 ******/
CREATE DATABASE [Chokin_DEV]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Chokin_DEV', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\Chokin_DEV.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Chokin_DEV_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\Chokin_DEV_log.ldf' , SIZE = 2048KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Chokin_DEV] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Chokin_DEV].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Chokin_DEV] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Chokin_DEV] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Chokin_DEV] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Chokin_DEV] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Chokin_DEV] SET ARITHABORT OFF 
GO
ALTER DATABASE [Chokin_DEV] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Chokin_DEV] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Chokin_DEV] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Chokin_DEV] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Chokin_DEV] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Chokin_DEV] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Chokin_DEV] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Chokin_DEV] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Chokin_DEV] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Chokin_DEV] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Chokin_DEV] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Chokin_DEV] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Chokin_DEV] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Chokin_DEV] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Chokin_DEV] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Chokin_DEV] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Chokin_DEV] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Chokin_DEV] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Chokin_DEV] SET  MULTI_USER 
GO
ALTER DATABASE [Chokin_DEV] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Chokin_DEV] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Chokin_DEV] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Chokin_DEV] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [Chokin_DEV] SET DELAYED_DURABILITY = DISABLED 
GO
USE [Chokin_DEV]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TypeId] [int] NOT NULL,
	[CurrencyId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[Debit] [numeric](18, 3) NOT NULL,
	[Credit] [numeric](18, 3) NOT NULL,
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Currency]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Currency](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nchar](20) NOT NULL,
	[Symbol] [nchar](5) NOT NULL,
	[Country] [nchar](3) NULL,
 CONSTRAINT [PK_Currency] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[JournalEntry]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[JournalEntry](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Amount] [numeric](18, 3) NOT NULL,
	[Date] [datetime] NOT NULL,
	[Concept] [nvarchar](500) NULL,
	[DebitAccountId] [int] NOT NULL,
	[CreditAccountId] [int] NOT NULL,
	[CurrencyId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[IsRecurring] [bit] NOT NULL,
	[IsCancelling] [bit] NOT NULL,
 CONSTRAINT [PK_JournalEntry] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[RecurringTransaction]    Script Date: 26/11/2016 20:11:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RecurringTransaction](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Concept] [nvarchar](500) NULL,
	[Amount] [decimal](18, 3) NOT NULL,
	[DebitAccountId] [int] NOT NULL,
	[CreditAcountId] [int] NOT NULL,
	[DayMonth] [tinyint] NOT NULL,
	[Active] [bit] NOT NULL,
	[UserId] [int] NOT NULL,
	[CurrencyId] [int] NOT NULL,
 CONSTRAINT [PK_RecurringTransaction] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Account]    Script Date: 26/11/2016 20:11:01 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Account] ON [dbo].[Account]
(
	[Name] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Currency]    Script Date: 26/11/2016 20:11:01 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Currency] ON [dbo].[Currency]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_RecurringTransaction]    Script Date: 26/11/2016 20:11:01 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_RecurringTransaction] ON [dbo].[RecurringTransaction]
(
	[Name] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Account] ADD  CONSTRAINT [DF_Account_Debit]  DEFAULT ((0)) FOR [Debit]
GO
ALTER TABLE [dbo].[Account] ADD  CONSTRAINT [DF_Account_Credit]  DEFAULT ((0)) FOR [Credit]
GO
ALTER TABLE [dbo].[Account]  WITH CHECK ADD  CONSTRAINT [FK_Account_Currency] FOREIGN KEY([CurrencyId])
REFERENCES [dbo].[Currency] ([Id])
GO
ALTER TABLE [dbo].[Account] CHECK CONSTRAINT [FK_Account_Currency]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[JournalEntry]  WITH CHECK ADD  CONSTRAINT [FK_JournalEntry_CreditAccount] FOREIGN KEY([CreditAccountId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[JournalEntry] CHECK CONSTRAINT [FK_JournalEntry_CreditAccount]
GO
ALTER TABLE [dbo].[JournalEntry]  WITH CHECK ADD  CONSTRAINT [FK_JournalEntry_Currency] FOREIGN KEY([CurrencyId])
REFERENCES [dbo].[Currency] ([Id])
GO
ALTER TABLE [dbo].[JournalEntry] CHECK CONSTRAINT [FK_JournalEntry_Currency]
GO
ALTER TABLE [dbo].[JournalEntry]  WITH CHECK ADD  CONSTRAINT [FK_JournalEntry_DebitAccount] FOREIGN KEY([DebitAccountId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[JournalEntry] CHECK CONSTRAINT [FK_JournalEntry_DebitAccount]
GO
ALTER TABLE [dbo].[RecurringTransaction]  WITH CHECK ADD  CONSTRAINT [FK_RecurringTransaction_CreditAccount] FOREIGN KEY([CreditAcountId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[RecurringTransaction] CHECK CONSTRAINT [FK_RecurringTransaction_CreditAccount]
GO
ALTER TABLE [dbo].[RecurringTransaction]  WITH CHECK ADD  CONSTRAINT [FK_RecurringTransaction_Currency] FOREIGN KEY([CurrencyId])
REFERENCES [dbo].[Currency] ([Id])
GO
ALTER TABLE [dbo].[RecurringTransaction] CHECK CONSTRAINT [FK_RecurringTransaction_Currency]
GO
ALTER TABLE [dbo].[RecurringTransaction]  WITH CHECK ADD  CONSTRAINT [FK_RecurringTransaction_DebitAccount] FOREIGN KEY([DebitAccountId])
REFERENCES [dbo].[Account] ([Id])
GO
ALTER TABLE [dbo].[RecurringTransaction] CHECK CONSTRAINT [FK_RecurringTransaction_DebitAccount]
GO
USE [master]
GO
ALTER DATABASE [Chokin_DEV] SET  READ_WRITE 
GO

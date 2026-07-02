---
last_updated: 2026-06
project: period-limited-api
status: Draft
title: Backend Coding Guideline
version: 1.0.0-draft
---

# Backend Coding Guideline

> Version: 1.0.0 (Draft)

## Table of Contents

1.  Introduction
2.  Architecture
3.  Project Structure
4.  Naming Convention
5.  Data Access Strategy
6.  SQL Coding Guideline
7.  Base Classes
8.  DAO Coding Guideline
9.  Service Coding Guideline
10. Controller Coding Guideline
11. Exception & Middleware Guideline
12. Pagination Guideline
13. Development Checklist

Appendix A. Coding Philosophy

------------------------------------------------------------------------

# 1. Introduction

## Purpose

本文件定義 **period-limited-api** 專案的後端開發規範。

目標：

-   建立一致的程式設計風格
-   提高可讀性與可維護性
-   降低團隊溝通成本
-   作為未來開發與 AI（Codex / ChatGPT）協作的共同標準

## Target Audience

-   Backend Developer
-   Code Reviewer
-   AI Coding Assistant
-   Future Contributor

## Scope

本文件涵蓋：

-   Backend Architecture
-   Folder Structure
-   Naming Convention
-   Data Access Strategy
-   SQL Coding Guideline
-   Base Classes
-   DAO Guideline
-   Service Guideline
-   Controller Guideline
-   Exception & Middleware Guideline
-   Pagination Guideline
-   Development Checklist

## Project Philosophy

1.  Readability over cleverness
2.  Consistency over personal preference
3.  SQL readability as a first-class concern
4.  Single Responsibility
5.  Maintainability over short-term convenience

## Documentation Style

-   Heading：英文
-   Description：繁體中文
-   Code：英文
-   每章固定包含 Purpose、Responsibilities、Rules、Good Example、Bad
    Example、Common Mistakes、Checklist

## Versioning

  Version       Description
  ------------- ----------------------
  1.0.0 Draft   初版 Guideline 草稿
  1.0.0         正式版本
  1.1.0         新增規範（向下相容）
  2.0.0         架構重大調整

## Change Log

  Version       Date      Description
  ------------- --------- ---------------------
  1.0.0 Draft   2026-06   建立 Guideline 初稿

------------------------------------------------------------------------

## Decision

本 Guideline 作為 period-limited-api 唯一的 Backend 開發規範。
所有新功能均應優先遵循本文件。

------------------------------------------------------------------------

## Rationale

先建立共同規範，再開始實作，可降低重工與 Code Review 成本，並提供 AI
與開發者一致的開發依據。

# 2. Architecture

## Purpose

本章定義 **period-limited-api** 的後端架構原則。

目標是讓所有功能模組都遵循相同的分層方式，避免 Controller、Service、Dao
職責混亂。

------------------------------------------------------------------------

## Responsibilities

本專案採用三層架構：

``` text
Controller
    ↓
Service
    ↓
Dao
    ↓
DbContext / SQL Server
```

各層職責如下：

  Layer        Responsibility
  ------------ ---------------------------------------------------------
  Controller   接收 Request、驗證 Request、呼叫 Service、回傳 Response
  Service      商業邏輯、流程控制、協調 Dao、決定 SaveChanges
  Dao          資料存取、Raw SQL、EF Core 查詢、JOIN、CRUD
  DbContext    EF Core Database Session
  Middleware   處理通用 System Exception

------------------------------------------------------------------------

## Rules

### Rule 1：Controller 不直接呼叫 Dao

Controller 只能呼叫 Service。

### Rule 2：Service 可以呼叫多個 Dao

Service 負責商業流程，因此可以協調多個 Dao。

例如新增活動時：

``` text
LimitedEventService
    ├── LimitedEventDao
    └── EventTagDao
```

### Rule 3：Dao 不呼叫其他 Dao

Dao 只負責資料存取，不負責流程整合。

### Rule 4：Dao 不呼叫 SaveChanges

Dao 只負責 Add、Update、Remove、Query。

真正的 Commit 由 Service 統一決定。

### Rule 5：System Exception 交給 Middleware

Controller 原則上不寫通用 try-catch。

------------------------------------------------------------------------

## Good Example

``` csharp
public class CategoryController : BaseController
{
    private readonly CategoryService _categoryService;

    public CategoryController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost]
    [Route("list")]
    public ActionResult GetList(CategoryQueryDto query)
    {
        var result = _categoryService.GetList(query);

        return Success(result);
    }
}
```

``` csharp
public class CategoryService
{
    private readonly CategoryDao _categoryDao;

    public CategoryService(CategoryDao categoryDao)
    {
        _categoryDao = categoryDao;
    }

    public ServiceResponse<PagedResult<CategoryDto>> GetList(CategoryQueryDto query)
    {
        var result = _categoryDao.GetList(query);

        return ServiceResponse<PagedResult<CategoryDto>>.Ok(result);
    }
}
```

``` csharp
public class CategoryDao
{
    private readonly PeriodLimitedDbContext _dbContext;

    public CategoryDao(PeriodLimitedDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public PagedResult<CategoryDto> GetList(CategoryQueryDto query)
    {
        string sql =
@"
SELECT
    c.Id AS Id,
    c.Name AS Name,
    c.Sort AS Sort

FROM Category c

WHERE
    c.DeleteFlag = 0
";

        return ExecuteQuery<PagedResult<CategoryDto>>(sql, new
        {
            query.Page,
            query.PageSize
        });
    }
}
```

------------------------------------------------------------------------

## Bad Example

``` csharp
public class CategoryController : ControllerBase
{
    private readonly PeriodLimitedDbContext _dbContext;

    public CategoryController(PeriodLimitedDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ActionResult GetList()
    {
        var result = _dbContext.Categories.ToList();

        return Ok(result);
    }
}
```

問題：

-   Controller 直接操作 DbContext
-   Controller 跳過 Service
-   Controller 承擔資料存取責任
-   回傳格式未統一
-   未使用 BaseController

------------------------------------------------------------------------

## Common Mistakes

-   Controller 直接注入 Dao。
-   Controller 直接注入 DbContext。
-   Service 回傳 ApiResponse。
-   Dao 呼叫其他 Dao。
-   Dao 呼叫 SaveChanges。
-   Controller 寫商業邏輯。
-   Controller 寫 SQL。
-   Controller 每支 API 都寫 try-catch。

------------------------------------------------------------------------

## Checklist

□ Controller 是否只呼叫 Service？

□ Service 是否負責商業邏輯？

□ Service 是否可以協調多個 Dao？

□ Dao 是否只負責資料存取？

□ Dao 是否沒有呼叫 SaveChanges？

□ Dao 是否沒有呼叫其他 Dao？

□ Controller 是否沒有直接操作 DbContext？

□ Controller 是否沒有撰寫 SQL？

□ Exception 是否交給 Middleware？

------------------------------------------------------------------------

## Decision

採用 Controller → Service → Dao 三層架構。 SaveChanges() 由 Service
統一管理。 System Exception 交由 Middleware 處理。

------------------------------------------------------------------------

## Rationale

明確切分 HTTP、Business、Data 三層責任，提升可維護性與可測試性。

## References

-   ASP.NET Core Web API
-   Entity Framework Core
-   Dependency Injection

------------------------------------------------------------------------

# 3. Project Structure

## Purpose

本章定義 **period-limited-api** 的目錄結構與各資料夾職責。

所有新功能皆應遵循相同的專案結構，避免不同開發者建立不同風格的目錄。

------------------------------------------------------------------------

## Responsibilities

每個資料夾應只負責單一職責，避免混用。

------------------------------------------------------------------------

## Standard Folder Structure

``` text
period-limited-api
│
├── Controllers/
│
├── Services/
│
├── Daos/
│
├── Models/
│   └── Base/
│
├── ViewModels/
│
├── Data/
│
├── Middleware/
│
├── Common/
│
├── Extensions/
│
├── docs/
│
└── Program.cs
```

------------------------------------------------------------------------

## Folder Description

  Folder        Responsibility
  ------------- ------------------------------------------------------
  Controllers   接收 HTTP Request，呼叫 Service，回傳 Response
  Services      商業邏輯、流程控制、Transaction、SaveChanges
  Daos          EF Core、Raw SQL、資料存取
  Models        Database Entity(Model)，對應資料表
  Models/Base   BaseModel 等共用 Entity
  ViewModels    QueryDto、Dto、Response DTO
  Data          DbContext、EF Core 設定
  Middleware    Global Exception Middleware 等
  Common        ApiResponse、ServiceResponse、PagedResult 等共用元件
  Extensions    DI、Middleware、Service Collection 擴充
  docs          Guideline、設計文件

------------------------------------------------------------------------

## Rules

### Rule 1

Model 與 ViewModel 分開管理。

不要將 DTO 放入 Models。

### Rule 2

Controller、Service、Dao 一律依功能建立檔案。

例如：

``` text
CategoryController
CategoryService
CategoryDao
```

### Rule 3

共用類別集中於 Common。

例如：

``` text
ApiResponse
ServiceResponse
PagedResult
```

### Rule 4

所有 Base Class 放於 Base 或 Common。

例如：

``` text
Models/Base/BaseModel.cs
Controllers/BaseController.cs
```

------------------------------------------------------------------------

## Good Example

``` text
Models/
    Base/
        BaseModel.cs
    CategoryModel.cs
    LimitedEventModel.cs

ViewModels/
    CategoryDto.cs
    CategoryQueryDto.cs
    LimitedEventDto.cs
```

------------------------------------------------------------------------

## Bad Example

``` text
Models/
    CategoryModel.cs
    CategoryDto.cs
    CategoryQueryDto.cs
```

問題：

-   Entity 與 DTO 混在一起
-   職責不清楚
-   維護成本增加

------------------------------------------------------------------------

## Common Mistakes

-   DTO 放入 Models
-   Response 放入 Models
-   共用類別散落各資料夾
-   Controller 存取 DbContext
-   Service 撰寫 SQL

------------------------------------------------------------------------

## Checklist

□ Models 是否只放 Entity？

□ ViewModels 是否只放 DTO / QueryDto？

□ 共用類別是否集中於 Common？

□ BaseModel 是否放於 Models/Base？

□ Controller / Service / Dao 是否依模組一一對應？

------------------------------------------------------------------------

## Decision

Model 與 ViewModel 分離。 共用元件集中於 Common。
所有模組採一致資料夾結構。

------------------------------------------------------------------------

## Rationale

一致的目錄結構能降低學習成本，新增模組時可直接依照既有模式建立。

## References

-   ASP.NET Core Project Structure
-   Clean Architecture

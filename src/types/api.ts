// GenFin backend (Django REST) umumiy tiplari.
// Manba: GenFin_Backend serializer'lari + .ai/docs/API_DOCUMENTATION.md.
// Eslatma: list serializer'lari detail'dan kamroq maydon qaytaradi —
// faqat detail'da bo'lgan maydonlar optional (`?`) qilingan.
// Decimal qiymatlar backenddan STRING bo'lib keladi ("1000000.00").

// ==================== COMMON ====================

export type Currency = "UZS" | "USD" | "EUR" | "RUB"
export type TransactionType = "income" | "expense" | "transfer"
export type AccountType = "cash" | "bank" | "card" | "electronic"
export type CounterpartyType = "client" | "supplier" | "partner" | "employee"
export type ProjectStatus = "active" | "inactive" | "completed" | "archived"
export type AssetCurrency = "UZS" | "USD" | "EUR" | "RUB"
export type LoanType = "bank" | "microfinance" | "personal" | "business"
export type LoanStatus = "active" | "closed" | "overdue"
export type PaymentStatus = "pending" | "approved" | "rejected" | "paid"
export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise"
export type SubscriptionStatus =
    | "active"
    | "expired"
    | "cancelled"
    | "suspended"

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ==================== OPERATIONS ====================

export interface Account {
    id: number
    name: string
    account_type: AccountType
    account_type_display: string
    currency: Currency
    currency_display: string
    balance: string
    bank_name?: string
    account_number?: string
    card_number?: string
    is_active: boolean
    created_at: string
    updated_at?: string
}

export interface ExchangeRate {
    currency: Currency
    currency_display: string
    rate: string
    is_manual: boolean
    updated_at: string
}

export interface AccountCreate {
    name: string
    account_type: AccountType
    currency: Currency
    bank_name?: string
    account_number?: string
    card_number?: string
    is_active?: boolean
}

export interface Category {
    id: number
    name: string
    icon?: string
    color?: string
    transaction_type: TransactionType
    transaction_type_display: string
    activity_type?: CashFlowActivityType
    activity_type_display?: string
    is_active: boolean
    parent?: number | null
    parent_name?: string
    has_children?: boolean
    created_at?: string
    updated_at?: string
}

export type CashFlowActivityType = "operating" | "investing" | "financing"

export interface CategoryCreate {
    name: string
    icon?: string
    color?: string
    transaction_type: TransactionType
    is_active?: boolean
    parent?: number | null
}

export interface Transaction {
    id: number
    transaction_type: TransactionType
    transaction_type_display: string
    amount: string
    currency: Currency
    currency_display: string
    description: string
    account: number
    account_name: string
    to_account?: number
    to_account_name?: string
    to_account_currency?: Currency
    // valyutalararo o'tkazmada qabul hisobiga tushgan summa (qabul valyutasida)
    to_amount?: string
    category?: number
    category_name?: string
    counterparty?: number
    counterparty_name?: string
    direction?: number
    direction_name?: string
    transaction_date: string
    // hisobga olish sanasi (asosiy sanadan farq qilsa) + tasdiqlangani
    accrual_date?: string | null
    is_accrual_confirmed?: boolean
    // rejalashtirilgan (hali amalga oshmagan) operatsiya — pul oqimiga kirmaydi
    is_planned?: boolean
    balance_after: string
    created_at?: string
    updated_at?: string
}

export interface TransactionCreate {
    transaction_type: TransactionType
    amount: string
    currency: Currency
    // ixtiyoriy: kirim/chiqimni tahrirlashda umuman yuborilmaydi (eski tavsif saqlanadi)
    description?: string
    account: number
    to_account?: number
    // valyutalararo o'tkazmada qabul hisobiga tushadigan summa (qabul valyutasida)
    to_amount?: string
    category?: number
    counterparty?: number
    direction?: number
    transaction_date: string
    accrual_date?: string | null
    is_accrual_confirmed?: boolean
    // kelasi sanaga yozilgan operatsiya — reja; balansga ta'sir qilmaydi
    is_planned?: boolean
}

// Operatsiyaga biriktirilgan fayl (chek, hisob-faktura va h.k.)
export interface TransactionAttachment {
    id: number
    transaction: number
    file: string
    file_url: string | null
    original_name: string
    content_type: string
    size: number
    created_at: string
}

export interface TransactionStatistics {
    total_income: string
    total_expense: string
    total_transfer: string
    balance: string
    transaction_count: number
}

// ==================== DIRECTIONS ====================

/** Loyiha — tushum kassa/hisoblanma sanasi bo'yicha; bitim — akt imzolangan payt. */
export type DirectionKind = "project" | "deal"

export interface Direction {
    id: number
    name: string
    description?: string
    icon?: string
    color?: string
    kind: DirectionKind
    kind_display: string
    status: ProjectStatus
    status_display: string
    group: number | null
    group_name: string | null
    manager: number | null
    manager_name: string | null
    legal_entity: number | null
    legal_entity_name: string | null
    counterparty: number | null
    counterparty_name: string | null
    is_public: boolean
    total_revenue: string
    total_expense: string
    profit: string
    profitability: string
    receivable: string
    plan_revenue: string
    plan_expense: string
    plan_profit: string
    plan_profitability: string
    created_at: string
    updated_at?: string
}

export interface DirectionCreate {
    name: string
    description?: string
    icon?: string
    color?: string
    kind?: DirectionKind
    status?: ProjectStatus
    group?: number | null
    manager?: number | null
    legal_entity?: number | null
    counterparty?: number | null
    is_public?: boolean
    plan_revenue?: string
    plan_expense?: string
}

export interface DirectionGroup {
    id: number
    name: string
    color?: string
    directions_count: number
    created_at: string
    updated_at?: string
}

// ==================== DIRECTION ANALYTICS ====================

/** Har bir KPI ikki qiymatli: `fact` (tan olingan) va `plan` (rejalashtirilgan). */
export interface DirectionKpi {
    fact: number
    plan: number
}

export interface DirectionSeriesPoint {
    date: string
    value: number
    /** `true` — bugundan keyingi nuqta, punktir chiziq bilan chiziladi. */
    is_forecast: boolean
}

export type DirectionOverviewMode = "profit" | "cashflow"

export type DirectionRange =
    | "current_month"
    | "current_quarter"
    | "current_year"
    | "prev_month"
    | "prev_quarter"
    | "prev_year"
    | "custom"
    | "all_time"

export interface DirectionProfitKpis {
    profit: DirectionKpi
    revenue: DirectionKpi
    expense: DirectionKpi
    profitability: DirectionKpi
}

export interface DirectionCashflowKpis {
    net_cash_flow: DirectionKpi
    inflow: DirectionKpi
    outflow: DirectionKpi
}

export interface DirectionOverview {
    id: number
    mode: DirectionOverviewMode
    range: DirectionRange
    today: string
    receivable: number
    kpis: DirectionProfitKpis | DirectionCashflowKpis
    series: DirectionSeriesPoint[]
}

export interface DirectionMonthlyDynamics {
    month: string
    year: number
    fact_revenue: number
    fact_expense: number
    planned_revenue: number
    planned_expense: number
}

export interface DirectionBreakdown {
    id: number
    range: DirectionRange
    monthly: DirectionMonthlyDynamics[]
    top_expense_counterparties: {
        id: number | null
        name: string | null
        total: number
    }[]
    expense_structure: {
        category_id: number | null
        name: string | null
        total: number
        percentage: number
    }[]
}

// ==================== OBLIGATIONS / ACCRUALS / DOCUMENTS ====================

/** `we_gave` — biz berdik; `they_gave` — bizga berishdi. */
export type ObligationTransfer = "we_gave" | "they_gave"

export interface Obligation {
    id: number
    direction: number
    direction_name: string | null
    counterparty: number | null
    counterparty_name: string | null
    legal_entity: number | null
    legal_entity_name: string | null
    /** To'ldirilgan bo'lsa — majburiyat tranzaksiyadan hosil bo'lgan. */
    source_transaction: number | null
    date: string
    amount: string
    currency: string
    transfer: ObligationTransfer
    transfer_display: string
    description?: string
    is_planned: boolean
    created_at: string
    updated_at?: string
}

export type AccrualKind = "revenue" | "cogs"

export interface Accrual {
    id: number
    direction: number
    direction_name: string | null
    category: number | null
    category_name: string | null
    counterparty: number | null
    counterparty_name: string | null
    kind: AccrualKind
    kind_display: string
    date: string
    amount: string
    currency: string
    description?: string
    created_at: string
    updated_at?: string
}

export interface DirectionDocument {
    id: number
    direction: number
    file: string | null
    file_url: string | null
    original_name: string
    content_type: string
    size: number
    uploaded_by: string | null
    created_at: string
    /** `transaction` — yo'nalish tranzaksiyasiga biriktirilgan (o'chirib bo'lmaydi). */
    source: "direction" | "transaction"
    transaction: number | null
}

// `directions/{id}/statistics/` — totals + oylik dinamika. Maydonlar son
// (float) sifatida keladi (DecimalField string'idan farqli).
export interface DirectionMonthly {
    month: string
    year: number
    revenue: number
    expense: number
    profit: number
}

export interface DirectionStatistics {
    id: number
    name: string
    status: ProjectStatus
    totals: {
        revenue: number
        expense: number
        profit: number
        profitability: number
        transactions_count: number
    }
    monthly: DirectionMonthly[]
}

// ==================== COUNTERPARTIES ====================

export interface Counterparty {
    id: number
    name: string
    counterparty_type: CounterpartyType
    counterparty_type_display: string
    phone?: string
    email?: string
    address?: string
    inn?: string
    bank_name?: string
    bank_account?: string
    contact_person?: string
    notes?: string
    is_active: boolean
    total_debt: string
    created_at?: string
    updated_at?: string
}

export interface CounterpartyCreate {
    name: string
    counterparty_type: CounterpartyType
    phone?: string
    email?: string
    address?: string
    inn?: string
    bank_name?: string
    bank_account?: string
    contact_person?: string
    notes?: string
    is_active?: boolean
}

// `counterparties/{id}/balance/` — jami kirim/chiqim va sof balans (son sifatida).
export interface CounterpartyBalance {
    counterparty_id: number
    name: string
    type: CounterpartyType
    total_income: number
    total_expense: number
    balance: number
    status: "receivable" | "payable" | "settled"
    transactions_count: number
}

// `counterparties/{id}/transactions/` — operatsiyalar tarixi. Bog'liq obyektlar
// (account/category/direction) nom satri sifatida keladi; amount — musbat son.
export interface CounterpartyTransaction {
    id: number
    transaction_type: TransactionType
    amount: number
    currency: Currency
    description: string
    account: string | null
    category: string | null
    direction: string | null
    transaction_date: string
    /** Reja operatsiyasi — hali balansga qo'llanmagan. */
    is_planned: boolean
}

export interface CounterpartyTransactions {
    counterparty_id: number
    name: string
    count: number
    transactions: CounterpartyTransaction[]
}

// ==================== PLANNING ====================

export interface Budget {
    id: number
    name: string
    category: number
    category_name: string
    amount: string
    spent: string
    remaining: string
    usage_percentage: string
    period_start: string
    period_end: string
    direction?: number
    direction_name?: string
    created_at?: string
    updated_at?: string
}

export interface BudgetCreate {
    name: string
    category: number
    amount: string
    spent?: string
    period_start: string
    period_end: string
    direction?: number
}

export type BudgetPeriodType = "daily" | "weekly" | "monthly"

export interface BudgetDirectionInfo {
    id: number
    name: string
    color?: string
}

// Adesk uslubidagi byudjet rejasi (davr × modda jadvali)
export interface BudgetPlan {
    id: number
    name: string
    period_type: BudgetPeriodType
    period_start: string
    period_end: string
    color?: string
    plan_amount?: string
    fact_amount?: string
    directions: number[]
    directions_info?: BudgetDirectionInfo[]
    // Orqaga moslik uchun (directions ning birinchisi)
    direction?: number | null
    direction_name?: string
    is_archived: boolean
    created_at?: string
    updated_at?: string
}

export interface BudgetPlanCreate {
    name: string
    period_type: BudgetPeriodType
    period_start: string
    period_end: string
    color?: string
    plan_amount?: string
    fact_amount?: string
    directions: number[]
}

export interface BudgetGridRow {
    id: number
    n: string
    /** Reja — har oy uchun qo'lda kiritilgan summa. */
    v: string[]
    /** Fakt — haqiqiy operatsiyalardan hisoblanadi (faqat o'qish uchun). */
    f?: string[]
    editable: boolean
    children?: BudgetGridRow[]
}

export interface BudgetGrid {
    months: string[]
    month_keys: string[]
    income: BudgetGridRow[]
    expense: BudgetGridRow[]
    income_totals: string[]
    expense_totals: string[]
    income_fact_totals?: string[]
    expense_fact_totals?: string[]
    saldo: string[]
    saldo_fact?: string[]
}

export interface BudgetSetEntryPayload {
    category: number
    month: string
    amount: string
}

export interface PaymentCalendar {
    id: number
    title: string
    description?: string
    amount: string
    due_date: string
    status: PaymentStatus
    status_display: string
    counterparty?: number
    counterparty_name?: string
    category?: number
    category_name?: string
    direction?: number
    direction_name?: string
    created_at?: string
    updated_at?: string
}

export interface PaymentCalendarCreate {
    title: string
    description?: string
    amount: string
    due_date: string
    status?: PaymentStatus
    counterparty?: number
    category?: number
    direction?: number
}

// To'lov kalendari — kunlik statistika (daily-stats action).
export interface DailyOperation {
    id: number
    time: string
    type: "income" | "expense" | "transfer"
    // Hisob filtri faolida transferning S bo'yicha yo'nalishi: "in" = hisobga
    // kirdi (+), "out" = hisobdan chiqdi (−), null = neytral (ichki/filtrsiz).
    transfer_flow: "in" | "out" | null
    category: string
    amount: string
    currency: Currency
    description: string
    account: string
    project: string | null
    counterparty: string | null
}

export interface DailyPayment {
    id: number
    title: string
    amount: string
    status: PaymentStatus
    category: string | null
    counterparty: string | null
}

export interface DailyStats {
    date: string
    balance: {
        current: string
        day_start: string
        day_end: string
    }
    operations: {
        income_total: string
        expense_total: string
        transfer_total: string
        net: string
        count: number
        list: DailyOperation[]
    }
    payments: {
        total: string
        paid: string
        pending: string
        count: number
        list: DailyPayment[]
    }
}

// To'lov kalendari — oylik statistika (monthly-stats action).
export interface DayStats {
    day: number
    date: string
    income: string
    expense: string
    net: string
    // Kun boshi/oxiri running-balance (monthly-stats backendda hisoblaydi).
    day_start: string
    day_end: string
    operations_count: number
    payments: {
        total: string
        paid: string
        count: number
    }
}

export interface MonthlyStats {
    year: number
    month: number
    days_in_month: number
    current_balance: string
    monthly_totals: {
        income: string
        expense: string
        net: string
        operations_count: number
        payments_total: string
        payments_count: number
    }
    daily: DayStats[]
}

export interface PaymentApproval {
    id: number
    title: string
    description?: string
    amount: string
    status: PaymentStatus
    status_display: string
    requested_by: number
    requested_by_name: string
    approved_by?: number
    approved_by_name?: string
    counterparty?: number
    counterparty_name?: string
    direction?: number
    direction_name?: string
    approved_at?: string
    rejection_reason?: string
    created_at: string
    updated_at?: string
}

export interface PaymentApprovalCreate {
    title: string
    description: string
    amount: string
    counterparty?: number
    direction?: number
}

export interface PaymentApprovalUpdate {
    status: PaymentStatus
    approved_by?: number
    approved_at?: string
    rejection_reason?: string
}

// payment-approvals/{id}/approve/ — ixtiyoriy ravishda tranzaksiya ham yaratadi.
export interface PaymentApprovalApproveRequest {
    create_transaction?: boolean
    account_id?: number
    category_id?: number
}

export interface PaymentApprovalApproveResponse {
    id: number
    title: string
    amount: string
    status: PaymentStatus
    approved_by: string
    approved_at: string
    transaction_created?: boolean
    transaction_id?: number
}

// payment-approvals/{id}/reject/
export interface PaymentApprovalRejectRequest {
    rejection_reason: string
}

export interface PaymentApprovalRejectResponse {
    id: number
    title: string
    status: PaymentStatus
    rejection_reason: string
    rejected_by: string
    rejected_at: string
}

// ==================== ACCOUNTING ====================

export interface FixedAsset {
    id: number
    name: string
    amortize: boolean
    quantity: number
    price_per_unit: string
    currency: AssetCurrency
    currency_display: string
    commission_date: string
    useful_life_months?: number | null
    supplier?: number | null
    supplier_name?: string
    legal_entity?: number | null
    legal_entity_name?: string
    vat_included: boolean
    vat_rate: string
    // hisoblanuvchi (read-only)
    total_cost: string
    vat_amount: string
    monthly_depreciation: string
    accumulated_depreciation: string
    residual_value: string
    created_at?: string
    updated_at?: string
}

export interface FixedAssetCreate {
    name: string
    amortize: boolean
    quantity: number
    price_per_unit: string
    currency: AssetCurrency
    commission_date: string
    useful_life_months?: number | null
    supplier: number
    // Formadan olib tashlangan, backendda ixtiyoriy.
    legal_entity?: number | null
    vat_included?: boolean
    vat_rate?: string
}

/** O'lchov birligi — sozlamalarda yaratiladi, tovar formasida tanlanadi. */
export interface Unit {
    id: number
    name: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

export interface UnitCreate {
    name: string
    is_active?: boolean
}

export interface Inventory {
    id: number
    name: string
    sku: string
    description?: string
    quantity: string
    unit: number
    unit_name: string
    // narx ixtiyoriy — xariddan oldin noma'lum bo'lishi mumkin
    unit_price: string | null
    currency: string
    currency_display?: string
    total_value: string
    // FIFO qatlamlari bo'yicha qoldiq qiymati (Adesk "На сумму").
    stock_value: string
    location?: string
    minimum_stock: string
    needs_restock: boolean
    direction?: number
    direction_name?: string
    created_at?: string
    updated_at?: string
}

// `currency`/`location`/`minimum_stock`/`direction` formadan olib tashlandi —
// backend ularni default qiymati bilan qoldiradi.
export interface InventoryCreate {
    name: string
    sku: string
    description?: string
    quantity: string
    unit: number
    unit_price?: string
}

// ── Ombor: Bitim (Deal), Xarid (Purchase), Sotuv (Sale), FIFO qatlam ──

export interface Deal {
    id: number
    name: string
    counterparty?: number
    counterparty_name?: string
    direction?: number
    direction_name?: string
    status: ProjectStatus
    status_display?: string
    currency: string
    currency_display?: string
    start_date: string
    close_date?: string
    revenue: string
    cogs: string
    margin: string
    created_at?: string
    updated_at?: string
}

export interface DealCreate {
    name: string
    counterparty?: number
    direction?: number
    status?: ProjectStatus
    currency: string
    start_date: string
    close_date?: string
}

export interface StockLayer {
    id: number
    inventory: number
    quantity: string
    remaining_quantity: string
    unit_cost: string
    currency: string
    currency_display?: string
    purchase_date: string
    created_at?: string
}

export interface PurchaseLine {
    id: number
    inventory: number
    inventory_name?: string
    inventory_sku?: string
    quantity: string
    unit_cost: string
    total_cost: string
}

export interface PurchaseLineCreate {
    inventory: number
    quantity: string
    unit_cost: string
}

export interface Purchase {
    id: number
    supplier: number
    supplier_name?: string
    deal?: number
    deal_name?: string
    direction?: number
    currency: string
    currency_display?: string
    purchase_date: string
    is_paid: boolean
    account?: number
    total_cost: string
    // detail:
    notes?: string
    transaction?: number
    vat_included?: boolean
    vat_rate?: string
    vat_amount?: string
    lines?: PurchaseLine[]
    created_at?: string
    updated_at?: string
}

// Xarid doim qarz sifatida yoziladi (`is_paid` yo'q) — pul to'langanda jurnaldagi
// reja operatsiyasi tasdiqlanadi. Valyuta bazaviy valyutadan olinadi.
export interface PurchaseCreate {
    supplier: number
    direction?: number
    purchase_date: string
    notes?: string
    lines: PurchaseLineCreate[]
}

export interface SaleLine {
    id: number
    inventory: number
    inventory_name?: string
    inventory_sku?: string
    quantity: string
    sale_price: string
    cogs_amount: string
    uncosted_quantity?: string
    revenue: string
    margin: string
}

export interface SaleLineCreate {
    inventory: number
    quantity: string
    sale_price: string
}

export interface Sale {
    id: number
    deal: number
    deal_name?: string
    customer?: number
    customer_name?: string
    direction?: number
    currency: string
    currency_display?: string
    sale_date: string
    is_paid: boolean
    account?: number
    revenue: string
    cogs: string
    margin: string
    // detail:
    notes?: string
    transaction?: number
    vat_included?: boolean
    vat_rate?: string
    vat_amount?: string
    lines?: SaleLine[]
    created_at?: string
    updated_at?: string
}

export interface SaleCreate {
    /** Bitim ixtiyoriy — sotuv modali uni so'ramaydi. */
    deal?: number
    customer?: number
    direction?: number
    sale_date: string
    /** Sotuv qarz sifatida yoziladi; to'lov jurnalda tasdiqlanadi. */
    is_paid: boolean
    vat_included?: boolean
    vat_rate?: string
    notes?: string
    lines: SaleLineCreate[]
}

export interface Loan {
    id: number
    name: string
    loan_type: LoanType
    loan_type_display: string
    principal_amount: string
    remaining_amount: string
    paid_amount: string
    payment_progress: string
    interest_rate: string
    loan_date: string
    maturity_date: string
    status: LoanStatus
    status_display: string
    lender?: number
    lender_name?: string
    direction?: number
    direction_name?: string
    notes?: string
    created_at?: string
    updated_at?: string
}

export interface LoanCreate {
    name: string
    loan_type: LoanType
    principal_amount: string
    remaining_amount: string
    interest_rate: string
    loan_date: string
    maturity_date: string
    status?: LoanStatus
    lender?: number
    direction?: number
    notes?: string
}

export type MovementType = "in" | "out" | "adjustment" | "transfer"

export interface InventoryMovement {
    id: number
    inventory: number
    inventory_name: string
    movement_type: MovementType
    movement_type_display: string
    quantity: string
    unit_price: string
    total_value: string
    movement_date: string
    balance_after: string
    reference?: string
    // Faqat detail serializer'da:
    notes?: string
    created_at?: string
    updated_at?: string
}

/** Tovar tarixi (birlashtirilgan xarid + sotuv) — `INVENTORY.HISTORY` javobi. */
export interface InventoryHistoryEntry {
    id: string
    date: string | null
    type: "purchase" | "sale"
    quantity: string
    unit_price: string
    total: string
    counterparty?: string | null
}

export interface InventoryMovementCreate {
    inventory: number
    movement_type: MovementType
    // Manfiy qiymat `out`/`adjustment` uchun (backend qoldiqni shunga qarab o'zgartiradi).
    quantity: string
    unit_price: string
    reference?: string
    notes?: string
}

export interface LoanPayment {
    id: number
    loan: number
    loan_name: string
    payment_date: string
    principal_payment: string
    interest_payment: string
    total_payment: string
    remaining_balance: string
    // Faqat detail serializer'da:
    notes?: string
    created_at?: string
    updated_at?: string
}

export interface LoanPaymentCreate {
    loan: number
    payment_date: string
    principal_payment: string
    interest_payment: string
    remaining_balance: string
    notes?: string
}

export type AmortizationPaymentType = "annuity" | "linear"

export interface AmortizationEntry {
    period: number
    payment_date: string
    total_payment: string
    principal_payment: string
    interest_payment: string
    remaining_balance: string
}

// loans/{id}/amortization_schedule/ javobi
export interface AmortizationSchedule {
    loan_id: number
    loan_name: string
    principal_amount: string
    interest_rate: string
    loan_period_months: number
    payment_type: AmortizationPaymentType
    total_interest: string
    total_amount_to_pay: string
    schedule: AmortizationEntry[]
}

// ==================== SUBSCRIPTION ====================

export interface SubscriptionPlanDetail {
    id: number
    plan: SubscriptionPlan
    plan_display: string
    name: string
    description: string
    price_monthly: string
    price_yearly: string
    max_transactions: number
    max_accounts: number
    max_directions: number
    max_users: number
    // Backend `features` — JSONField (default=dict). Amalda turli shaklda
    // keladi: vergul bilan ajratilgan matn (seed), massiv yoki obyekt (admin).
    // `normalizeFeatures` barchasini string[] ga keltiradi.
    features: string | string[] | Record<string, unknown>
    is_active: boolean
}

export interface Subscription {
    id: number
    user: number
    user_email: string
    plan: SubscriptionPlan
    plan_display: string
    status: SubscriptionStatus
    status_display: string
    start_date: string
    end_date: string
    auto_renew: boolean
    created_at: string
    updated_at?: string
}

export interface SubscriptionCreate {
    plan: SubscriptionPlan
    start_date: string
    end_date: string
    auto_renew?: boolean
}

export interface SubscriptionPayment {
    id: number
    subscription: number
    subscription_plan: string
    user_email: string
    amount: string
    payment_date: string
    payment_method: string
    transaction_id: string
    status: string
    created_at?: string
    updated_at?: string
}

export interface SubscriptionPaymentCreate {
    subscription: number
    amount: string
    payment_method: string
    transaction_id: string
}

// To'lov shlyuzi (Click / Payme) — backend: subscription/payment/initiate/
export type GatewayMethod = "click" | "payme" | "octo"
export type GatewayStatus =
    | "pending"
    | "processing"
    | "success"
    | "failed"
    | "cancelled"
    | "refunded"

export interface PaymentGatewayTransaction {
    id: number | string
    user: number
    user_email: string
    subscription_payment: number | null
    payment_method: GatewayMethod
    payment_method_display: string
    status: GatewayStatus
    status_display: string
    order_id: string
    amount: string
    currency: string
    gateway_transaction_id: string | null
    merchant_transaction_id: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gateway_response: Record<string, any>
    error_message: string
    initiated_at: string
    completed_at: string | null
    cancelled_at: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>
    created_at: string
    updated_at: string
}

export interface InitiatePaymentRequest {
    subscription_plan: string
    payment_method: GatewayMethod
    amount: number
    months?: number
    return_url?: string
}

export interface InitiatePaymentResponse {
    payment_url: string
    order_id: string
    transaction: PaymentGatewayTransaction
}

// ==================== REPORTS ====================
// Backend Decimal qiymatlarni string sifatida qaytaradi (`v`, `*_totals` va h.k.).
// Frontend'da `Number(...)` bilan songa o'tkaziladi (`-format.ts` → `toRows`).

/** Katakni ochish uchun `operations/transactions/` filtri (masalan `category=1,2`). */
export interface ReportDrilldown {
    param: string
    value: string
}

/** Ustunning sana oralig'i; `date_to` inklyuziv. */
export interface ReportRange {
    date_from: string
    date_to: string
}

export interface ApiReportRow {
    n: string
    v: string[]
    children: ApiReportRow[] | null
    /** Valyutali hisob uchun asl valyuta kodi (masalan "USD"); aks holda null. */
    cur?: string | null
    /** Asl valyutadagi oylik qiymatlar (cur bilan birga); aks holda null. */
    nv?: string[] | null
    /** Katakni ochish filtri; `activity` guruhlashda `null`. */
    f?: ReportDrilldown | null
}

export type CashFlowGroupBy =
    | "article"
    | "activity"
    | "bank_account"
    | "contractor"
    | "project"

export interface CashFlowReport {
    months: string[]
    /** Har bir ustunning sana oralig'i (`months` bilan bir xil uzunlikda). */
    ranges?: ReportRange[]
    group_by?: CashFlowGroupBy
    openings: string[]
    income: ApiReportRow[]
    expense: ApiReportRow[]
    income_totals: string[]
    expense_totals: string[]
    transfers_in?: string[]
    transfers_out?: string[]
    transfers_total?: string[]
    net_cash_flow: string[]
    closings: string[]
    openings_by_account?: ApiReportRow[]
    closings_by_account?: ApiReportRow[]
}

export interface ProfitLossReport {
    months: string[]
    revenue: ApiReportRow[]
    cogs: ApiReportRow[]
    direct_expense: ApiReportRow[]
    indirect_expense: ApiReportRow[]
    other_income: ApiReportRow[]
    other_expense: ApiReportRow[]
    withdrawal: ApiReportRow[]
    revenue_totals: string[]
    cogs_totals: string[]
    direct_expense_totals: string[]
    gross_profit: string[]
    indirect_expense_totals: string[]
    operating_profit: string[]
    other_income_totals: string[]
    other_expense_totals: string[]
    net_profit: string[]
    withdrawal_totals: string[]
    retained_profit: string[]
}

export interface BalanceSheetReport {
    months: string[]
    current_assets: ApiReportRow[]
    fixed_assets: ApiReportRow[]
    current_liabilities: ApiReportRow[]
    long_term_liabilities: ApiReportRow[]
    equity: ApiReportRow[]
    current_assets_totals: string[]
    fixed_assets_totals: string[]
    total_assets: string[]
    current_liabilities_totals: string[]
    long_term_liabilities_totals: string[]
    equity_totals: string[]
    total_liabilities_equity: string[]
    net_profit: string[]
    profit_withdrawal: string[]
}

// ==================== ANALYTICS ====================
// Eslatma: Reports'dan farqli, Analytics endpointlari Decimal'larni `float`
// (number) sifatida qaytaradi (backend `d()` helper'i), string emas.

export interface DashboardKpis {
    total_balance: number
    income_this_month: number
    expense_this_month: number
    net_profit_this_month: number
    income_growth_pct: number
    expense_growth_pct: number
    accounts_count: number
    counterparties_count: number
    directions_count: number
}

export interface DashboardCashFlowPoint {
    month: string
    year: number
    income: number
    expense: number
    net: number
}

export interface CategoryDistribution {
    category_id: number | null
    name: string
    color: string
    total: number
}

export interface DashboardAccount {
    id: number
    name: string
    account_type: AccountType
    currency: Currency
    balance: number
}

export interface DashboardTransaction {
    id: number
    transaction_type: TransactionType
    amount: number
    currency: Currency
    description: string
    category: string | null
    account: string | null
    counterparty: string | null
    direction: string | null
    transaction_date: string
}

export interface DashboardDirection {
    id: number
    name: string
    revenue: number
    expense: number
    profit: number
    profitability: number
}

export interface DashboardData {
    kpis: DashboardKpis
    cash_flow: DashboardCashFlowPoint[]
    income_by_category: CategoryDistribution[]
    expense_by_category: CategoryDistribution[]
    accounts: DashboardAccount[]
    recent_transactions: DashboardTransaction[]
    top_directions: DashboardDirection[]
}

export interface DebtsSummary {
    total_receivable: number
    total_payable: number
    counterparty_payable: number
    loans_remaining: number
    net_position: number
}

export interface DebtParty {
    counterparty_id: number
    name: string
    type: CounterpartyType
    amount: number
}

export interface DebtLoan {
    loan_id: number
    name: string
    loan_type: LoanType
    status: LoanStatus
    principal_amount: number
    remaining_amount: number
    maturity_date: string
    lender: string | null
}

export interface DebtsReport {
    summary: DebtsSummary
    receivables: DebtParty[]
    payables: DebtParty[]
    loans: DebtLoan[]
}

export interface ExpenseAnalysisSummary {
    total_expense: number
    avg_per_month: number
    months: number
    transactions_count: number
}

export interface ExpenseByCategory {
    category_id: number | null
    name: string
    color: string
    total: number
    count: number
    percentage: number
}

export interface ExpenseByDirection {
    direction_id: number | null
    name: string
    total: number
    count: number
    percentage: number
}

export interface ExpenseByCounterparty {
    counterparty_id: number | null
    name: string
    total: number
    count: number
    percentage: number
}

export interface ExpenseMonthlyTrend {
    month: string
    year: number
    total: number
}

export interface ExpenseAnalysis {
    summary: ExpenseAnalysisSummary
    by_category: ExpenseByCategory[]
    by_direction: ExpenseByDirection[]
    by_counterparty: ExpenseByCounterparty[]
    monthly_trend: ExpenseMonthlyTrend[]
}

export interface CapitalizationComposition {
    assets: {
        cash: number
        fixed_assets: number
        inventory: number
        receivables: number
        total: number
    }
    liabilities: {
        loans: number
        payables: number
        total: number
    }
    capital: number
}

export interface CapitalizationMonthly {
    month: string
    year: number
    net_change: number
    capital: number
}

export interface Capitalization {
    composition: CapitalizationComposition
    monthly_capital: CapitalizationMonthly[]
}

// ==================== SETTINGS ====================

export type ActivityType = "it_finance" | "trade" | "manufacturing" | "services"
export type DateFormat = "DD.MM.YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
export type AutoLogoutMinutes = 0 | 15 | 30 | 60
export type NotificationType =
    | "transactions"
    | "budgets"
    | "payments"
    | "invoices"
    | "reports"
    | "team"
    | "system"
export type LegalType = "mchj" | "yatt" | "aj" | "qk" | "other"
export type LegalStatus = "active" | "inactive" | "pending"

export interface CompanySettings {
    company_name: string
    tax_id: string
    activity_type: ActivityType | ""
    activity_type_display?: string
    address: string
    base_currency: Currency
    base_currency_display?: string
    timezone: string
    date_format: DateFormat
    fiscal_year_start_month: number
    created_at?: string
    updated_at?: string
}

export interface SecuritySettings {
    two_factor_enabled: boolean
    suspicious_login_alerts: boolean
    auto_logout_minutes: AutoLogoutMinutes
    auto_logout_display?: string
    created_at?: string
    updated_at?: string
}

export interface NotificationPreference {
    id: number
    notification_type: NotificationType
    notification_type_display?: string
    email_enabled: boolean
    push_enabled: boolean
}

export interface LegalEntity {
    id: number
    name: string
    tax_id: string
    legal_type: LegalType
    legal_type_display?: string
    is_primary: boolean
    status: LegalStatus
    status_display?: string
    is_active: boolean
    created_at: string
    updated_at?: string
}

export interface AccountGroup {
    id: number
    name: string
    color?: string
    accounts_count: number
    total_balance: string
    created_at: string
}

export interface CounterpartyGroup {
    id: number
    name: string
    color?: string
    counterparties_count: number
    total_debt: string
    created_at: string
}

// ==================== AUTOMATION ====================

export type AutomationTrigger = "transaction_created" | "transaction_updated"

export type AutomationField =
    | "description"
    | "amount"
    | "transaction_type"
    | "account"
    | "counterparty"

export type AutomationOperator =
    | "contains"
    | "equals"
    | "startswith"
    | "gt"
    | "lt"

export type AutomationAction =
    | "set_category"
    | "set_direction"
    | "set_counterparty"

export interface AutomationRule {
    id: number
    name: string
    is_active: boolean
    /** Kichik raqam — yuqori ustuvorlik. */
    priority: number
    trigger_event: AutomationTrigger
    trigger_event_display: string
    condition_field: AutomationField
    condition_field_display: string
    condition_operator: AutomationOperator
    condition_operator_display: string
    condition_value: string
    action_type: AutomationAction
    action_type_display: string
    action_category: number | null
    action_direction: number | null
    action_counterparty: number | null
    created_at: string
    updated_at: string
}

export interface AutomationRuleCreate {
    name: string
    is_active: boolean
    priority: number
    trigger_event: AutomationTrigger
    condition_field: AutomationField
    condition_operator: AutomationOperator
    condition_value: string
    action_type: AutomationAction
    action_category?: number | null
    action_direction?: number | null
    action_counterparty?: number | null
}

// ==================== REFERRAL ====================

export type ReferralStatus = "active" | "pending" | "completed" | "cancelled"

export interface Referral {
    id: number
    referred_name: string
    referred_email?: string
    referral_code: string
    plan?: SubscriptionPlan | ""
    plan_display?: string
    bonus_amount: string
    status: ReferralStatus
    status_display?: string
    referrer_email?: string
    created_at: string
    updated_at?: string
}

export interface ReferralMyCode {
    referral_code: string
    referral_link: string
}

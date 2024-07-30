export default class WithdrawalRequestStatus {
    static NEW = 0;
    static APPROVED_BY_COMMITTEE = 1;
    static REJECTED = 2;
    static WITHDRAWN = 3;

    static getStatus(number) {
        switch (number) {
            case 0:
            case "0":
                return WithdrawalRequestStatus.NEW
            case 1:
            case "1":
                return WithdrawalRequestStatus.APPROVED_BY_COMMITTEE;
            case 2:
            case "2":
                return WithdrawalRequestStatus.REJECTED;
            case 3:
            case "3":
                return WithdrawalRequestStatus.WITHDRAWN;
            default:
                throw new Error(`No WithdrawalRequestStatus with id ${number}`);
        }
    }

    static getPrintableName(number) {
        switch (number) {
            case 0:
                return "New"
            case 1:
                return "Approved";
            case 2:
                return "Rejected";
            case 3:
                return "Withdrawn";
            default:
                throw new Error(`No WithdrawalRequestStatus with id ${number}`);

        }
    }

}

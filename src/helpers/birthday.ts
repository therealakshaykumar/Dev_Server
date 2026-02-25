export function isBirthdayToday(dateOfBirth: string | Date): boolean {
    if (!dateOfBirth) return false;

    const today = new Date();
    const dob = new Date(dateOfBirth);

    return (
        today.getDate() === dob.getDate() &&
        today.getMonth() === dob.getMonth()
    );
}
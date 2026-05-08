import EmailListItem from "./EmailListItem";

export default function InboxList({
    emails,
    selectedEmail,
    onSelect,
    completedIds = [],
}) {
    return (
        <div className="space-y-3">
            {emails.map((email) => (
                <EmailListItem
                    key={email.id}
                    email={email}
                    selected={selectedEmail?.id === email.id}
                    completed={completedIds.includes(email.id)}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
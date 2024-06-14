import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/context/AdminContext"
import ConfirmDialog from './ConfirmDialog';

function MoveHorizontalIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="18 8 22 12 18 16" />
            <polyline points="6 8 2 12 6 16" />
            <line x1="2" x2="22" y1="12" y2="12" />
        </svg>
    )
}

const UserTable = () => {
    const { users } = useAdmin();
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogType, setDialogType] = useState('');

    const handleMenuClick = (user: any, type: string) => {
        setSelectedUser(user);
        setDialogType(type);
    };

    const handleConfirm = () => {
        if (dialogType === 'promote') {
            console.log("Promote user:", selectedUser);
            // Add your promote user logic here
        } else if (dialogType === 'delete') {
            console.log("Delete user:", selectedUser);
            // Add your delete user logic here
        }
        setSelectedUser(null);
        setDialogType('');
    };

    const handleCancel = () => {
        setSelectedUser(null);
        setDialogType('');
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Положительные <br /> генерации</TableHead>
                        <TableHead>Отрицательные <br /> генерации</TableHead>
                        <TableHead>Все генерации</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.is_admin ? "default" : "destructive"}>
                                    {user.is_admin ? "Админ" : "Пользователь"}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.good_generated}</TableCell>
                            <TableCell>{user.bad_generated}</TableCell>
                            <TableCell>{user.all_generated}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoveHorizontalIcon className="w-4 h-4" />
                                            <span className="sr-only">Actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="text-black bg-white">
                                        <DropdownMenuItem onClick={() => handleMenuClick(user, 'promote')}>
                                            <Button className="border-black border w-[95%]">Сделать администратором</Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleMenuClick(user, 'delete')}>
                                            <Button className="bg-red w-[95%]">Удалить пользователя</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ConfirmDialog
                open={selectedUser !== null}
                title={dialogType === 'promote' ? 'Подтвердите Повышение' : 'Подтвердите Удаление'}
                description={dialogType === 'promote' ? 'Вы уверены, что хотите повысить этого пользователя до администратора?' : 'Вы уверены, что хотите удалить этого пользователя?'}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
};

export default UserTable;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';

interface TesterManagementProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
}

export const TesterManagement: React.FC<TesterManagementProps> = ({
  users,
  onUpdateUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleMakeTester = (userId: string) => {
    onUpdateUser(userId, { 
      role: 'tester', 
      isTester: true 
    });
  };

  const handleRemoveTester = (userId: string) => {
    onUpdateUser(userId, { 
      role: 'user', 
      isTester: false 
    });
  };

  const testers = filteredUsers.filter(user => user.isTester || user.role === 'tester');
  const regularUsers = filteredUsers.filter(user => !user.isTester && user.role !== 'tester');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ניהול טסטרים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* חיפוש משתמשים */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש משתמש לפי שם, אימייל או טלפון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* רשימת טסטרים קיימים */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                טסטרים פעילים ({testers.length})
              </h3>
              {testers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">אין טסטרים פעילים כרגע</p>
              ) : (
                <div className="grid gap-3">
                  {testers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email || user.phone}</p>
                          <p className="text-xs text-gray-500">{user.city}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          טסטר
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveTester(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        הסר טסטר
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* רשימת משתמשים רגילים */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                משתמשים רגילים ({regularUsers.length})
              </h3>
              {regularUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">לא נמצאו משתמשים</p>
              ) : (
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {regularUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email || user.phone}</p>
                          <p className="text-xs text-gray-500">{user.city}</p>
                        </div>
                        {user.verified && (
                          <Badge variant="outline" className="text-blue-600">
                            מאומת
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMakeTester(user.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        הפוך לטסטר
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
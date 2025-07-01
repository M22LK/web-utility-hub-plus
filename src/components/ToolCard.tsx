
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Star } from 'lucide-react';
import { Tool } from '@/data/tools';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(tool.route);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-3xl mb-2">{tool.icon}</div>
          <div className="flex gap-1">
            {tool.featured && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {tool.popular && (
              <Badge variant="default" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={handleClick}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          Use Tool
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;

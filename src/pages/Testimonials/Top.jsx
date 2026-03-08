import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Loader2, Star, CheckCircle, Clock, Quote } from "lucide-react";

const Top = ({ onFilterChange }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/testimonials",
          {
            withCredentials: true,
          }
        );
        const data = response.data.data || response.data;
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Calculate Real Stats from BE Data
  const totalCount = testimonials.length;
  const publishedCount = testimonials.filter((t) => t.isApproved).length;
  const pendingCount = totalCount - publishedCount;

  const avgRating =
    totalCount > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) / totalCount
        ).toFixed(1)
      : "0.0";

  const stats = [
    {
      label: "Total Testimonials",
      value: loading ? "..." : totalCount,
      change: "Lifetime",
      changeColor: "secondary",
      icon: <Quote size={20} className="text-blue-500" />,
    },
    {
      label: "Average Rating",
      value: loading ? "..." : `${avgRating}/5.0`,
      change: "High Quality",
      changeColor: "default",
      icon: <Star size={20} className="text-amber-500 fill-amber-500" />,
    },
    {
      label: "Published Count",
      value: loading ? "..." : publishedCount,
      change: `${totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0}%`,
      changeColor: "success",
      icon: <CheckCircle size={20} className="text-emerald-500" />,
    },
    {
      label: "Pending Approval",
      value: loading ? "..." : pendingCount,
      change: pendingCount > 0 ? "Action Req." : "Clean",
      changeColor: pendingCount > 0 ? "destructive" : "secondary",
      icon: <Clock size={20} className="text-orange-500" />,
    },
  ];

  const filters = ["All", "Published", "Pending", "Featured"];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter); // Pass filter up to main list
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 4 Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col transition-all duration-300 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                {stat.icon}
              </div>
              {!loading && stat.change && (
                <Badge
                  variant={stat.changeColor}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                >
                  {stat.change}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground leading-none mb-1">
              {stat.value}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3">
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            variant={activeFilter === filter ? "default" : "outline"}
            className={`rounded-xl text-sm font-bold transition-all px-6 py-2 h-auto ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            {filter}
          </Button>
        ))}
        {loading && (
          <Loader2
            className="animate-spin text-muted-foreground ml-2"
            size={20}
          />
        )}
      </div>
    </div>
  );
};

export default Top;
